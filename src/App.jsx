import { Button, Card, Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function App() {
  const [captchaImage, setCaptchaImage] = useState(null);
  const [session, setSession] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const generateSession = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "contract/generate",
    );
    const { session, image } = response.data;

    setCaptchaImage(image);
    setSession(session);
  };

  const onSubmit = async (data) => {
    try {
      const { address1, address2, address3, ...formData } = data;
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "contract/sign",
        {
          ...formData,
          // address: `${address1} ${address2} ${address3}`,
          captcha: parseInt(data.captcha),
          session,
        },
      );

      alert("Arizangiz yuborildi");
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const formFieldRule = {
    required: true,
  };

  useEffect(() => {
    generateSession();
  }, []);

  return (
    <div>
      <center>
        <Document file={"/public_offer.pdf"}>
          {[1, 2, 3, 4].map((page) => (
            <>
              <Page
                pageNumber={page}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
              <p>{page}</p>
            </>
          ))}
        </Document>
        <br />
        <br />
        <Card title={"Tasdiqlash formasi"}>
          <form onSubmit={handleSubmit(onSubmit)} className={"agreement-form"}>
            <Controller
              control={control}
              rules={formFieldRule}
              name={"lastName"}
              render={({ field }) => (
                <Input placeholder={"Familiya"} {...field} />
              )}
            />

            <Controller
              control={control}
              rules={formFieldRule}
              name={"firstName"}
              render={({ field }) => <Input placeholder={"Ism"} {...field} />}
            />

            <Controller
              control={control}
              rules={formFieldRule}
              name={"phoneNumber"}
              render={({ field }) => (
                <Input
                  type={"number"}
                  placeholder={"Telefon raqam"}
                  {...field}
                />
              )}
            />
            {/* <span className={"input-address-text"}>
              O'quv materiallarni yetkazib berish uchun manzilingizni kiriting
            </span>
            <div className={"input-address-container"}>
              <Controller
                control={control}
                rules={formFieldRule}
                name={"address1"}
                render={({ field }) => (
                  <Input placeholder={"Viloyat"} {...field} />
                )}
              />*/}

            {/* <Controller
                control={control}
                rules={formFieldRule}
                name={"address2"}
                render={({ field }) => (
                  <Input placeholder={"Tuman/shahar"} {...field} />
                )}
              />*/}

            {/* <Controller
                control={control}
                rules={formFieldRule}
                name={"address3"}
                render={({ field }) => (
                  <Input placeholder={"Mahalla"} {...field} />
                )}
              />*/}
            {/* </div>*/}
            <div className={"input-captcha-container"}>
              <img
                src={`data:image/png;base64,${captchaImage}`}
                alt="captcha"
              />
              <Controller
                control={control}
                rules={formFieldRule}
                name={"captcha"}
                render={({ field }) => (
                  <Input placeholder={"Rasmdagi sonni kiriting"} {...field} />
                )}
              />
              <Button onClick={generateSession}>Yangilash</Button>
            </div>
            <Button htmlType={"submit"} type={"primary"}>
              Yuborish
            </Button>
            <p>
              Formani to'lidirib, yuborish orqali yuqoridagi shartnoma
              shartlariga rozilik bildirgan bo'lasiz
            </p>
            <p>©ITEACH-GROUP LLC. 2025</p>
          </form>
        </Card>
      </center>
    </div>
  );
}

export default App;
