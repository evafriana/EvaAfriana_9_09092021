import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage";
import firestore from "../app/Firestore.js";
import userEvent from "@testing-library/user-event";
import { ROUTES_PATH } from "../constants/routes.js";
import firebase from "../__mocks__/firebase.js";
import BillsUI from "../views/BillsUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // test handleChangeFile
    test("Then I can chose one file to upload", async () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      // const fire = {
      //   storage: jest.fn(),
      // };

      // fire.storage.ref = jest.fn((e) => {
      //   return { put: jest.fn().mockResolvedValue() };
      // });

      const newBillContainer = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn((e) =>
        newBillContainer.handleChangeFile(e)
      );

      const fileId = screen.getByTestId("file");
      fileId.addEventListener("change", handleChangeFile);
      userEvent.upload(
        fileId,
        new File([""], "eva.jpg", { type: "image/png" })
      );

      expect(handleChangeFile).toHaveBeenCalled();
    });

    // test handleSubmit
    describe("And I click send button", () => {
      test("Then should navigate to bills page", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;

        const newBill = new NewBill({
          document,
          onNavigate: () => {},
          firestore: null,
          localStorage: null,
        });

        const sendPageBills = jest.fn((e) =>
          newBill.onNavigate(ROUTES_PATH["Bills"])
        );

        const btnSendBill = document.getElementById("btn-send-bill");
        btnSendBill.addEventListener("click", sendPageBills);
        userEvent.click(btnSendBill);
        expect(sendPageBills).toHaveBeenCalled();
      });
    });

    // test d'intégration POST
    test("Post bills from mock API GET", async () => {
      const postBill = jest.spyOn(firebase, "post");

      const dataBill = {
        type: "services en ligne",
        name: "",
        date: "01/10/2021",
        amount: 720,
        vat: 70,
        pct: 20,
        comment: "",
        fileUrl: "",
        fileName: "test.png",
        email: "test@test",
      };

      const bills = await firebase.post(dataBill);

      expect(postBill).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test("Post bills from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("Post bill from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
