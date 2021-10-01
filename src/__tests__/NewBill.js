import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage";
import firestore from "../app/Firestore.js";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import firebase from "../__mocks__/firebase.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // test handleChangeFile
    test("Then I can chose one file to upload", () => {
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
      const newBill = new NewBill({
        document,
        onNavigate: () => {},
        firestore,
        localStorage: window.localStorage,
      });
      const changeFile = jest.fn(newBill.handleChangeFile);
      const fileId = screen.getByTestId("file");
      fileId.addEventListener("change", changeFile);
      userEvent.upload(
        fileId,
        new File([""], "eva.jpg", { type: "image/png" })
      );
      const storageRef = jest.fn(newBill.firestore.ref);
      expect(storageRef).toBe(1);
      expect(changeFile).toHaveBeenCalled();
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
  });
});
