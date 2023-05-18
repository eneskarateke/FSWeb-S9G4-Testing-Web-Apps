import React from "react";
import {
  getByRole,
  render,
  screen,
  waitFor,
  fireEvent,
  getByLabelText,
  getByTestId,
  queryByTestId,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  // Arrange
  render(<IletisimFormu />);
  // Act
  const h1 = screen.getByRole("heading");
  const headerText = screen.getByText(/İletişim Formu/i);

  // Assert
  expect(h1).toBeInTheDocument();

  expect(headerText).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", () => {
  render(<IletisimFormu />);

  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Enes" } });

  //   const submitButton = getByText("Gönder");
  //   fireEvent.click(submitButton);

  const errorText = screen.getByText("Hata: ad en az 5 karakter olmalıdır.");
  expect(errorText).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);

  //   const adInput = screen.getByPlaceholderText("İlhan");
  //   const soyadInput = screen.getByPlaceholderText("Mansız");
  //   const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  const button = screen.getByText("Gönder");

  fireEvent.click(button);
  //   fireEvent.change(adInput, { target: { value: "" } });
  //   fireEvent.change(soyadInput, { target: { value: "" } });
  //   fireEvent.change(emailInput, { target: { value: "" } });

  const errorElement1 = screen.getByText(
    "Hata: ad en az 5 karakter olmalıdır."
  );
  const errorElement2 = screen.getByText("Hata: soyad gereklidir.");
  const errorElement3 = screen.getByText(
    "Hata: email geçerli bir email adresi olmalıdır."
  );

  expect(errorElement1).toBeInTheDocument();
  expect(errorElement2).toBeInTheDocument();
  expect(errorElement3).toBeInTheDocument();
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);

  const adInput = screen.getByPlaceholderText("İlhan");
  const soyadInput = screen.getByPlaceholderText("Mansız");
  const button = screen.getByText("Gönder");

  fireEvent.change(adInput, { target: { value: "Hamza" } });
  fireEvent.change(soyadInput, { target: { value: "Karateke" } });

  fireEvent.click(button);

  const errorElement = screen.getByText(
    "Hata: email geçerli bir email adresi olmalıdır."
  );

  expect(errorElement).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");

  fireEvent.change(emailInput, { target: { value: "asdfsad" } });

  const errorElement3 = screen.getByText(
    "Hata: email geçerli bir email adresi olmalıdır."
  );

  expect(errorElement3).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const adInput = screen.getByPlaceholderText("İlhan");
  const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  const button = screen.getByText("Gönder");

  fireEvent.change(adInput, { target: { value: "sadasdasd" } });
  fireEvent.change(emailInput, { target: { value: "eneskarateke@gmail.com" } });
  fireEvent.click(button);

  const errorElement2 = screen.getByText("Hata: soyad gereklidir.");

  expect(errorElement2).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const { getByLabelText, getByText, queryByTestId, getByTestId } = render(
    <IletisimFormu />
  );

  fireEvent.change(getByLabelText("Ad*"), { target: { value: "hamza" } });
  fireEvent.change(getByLabelText("Soyad*"), { target: { value: "karateke" } });
  fireEvent.change(getByLabelText("Email*"), {
    target: { value: "eneskarteke@gmail.com" },
  });

  fireEvent.click(getByText("Gönder"));

  expect(getByTestId("display-data")).toBeInTheDocument();
  expect(queryByTestId("error4")).toBeNull;
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const { getByLabelText, getByText, getByTestId } = render(<IletisimFormu />);

  fireEvent.change(getByLabelText("Ad*"), { target: { value: "hamza" } });
  fireEvent.change(getByLabelText("Soyad*"), { target: { value: "karateke" } });
  fireEvent.change(getByLabelText("Email*"), {
    target: { value: "eneskarteke@gmail.com" },
  });
  fireEvent.change(getByLabelText("Mesaj"), { target: { value: "hello" } });

  fireEvent.click(getByText("Gönder"));

  expect(getByTestId("display-data")).toBeInTheDocument();
});
