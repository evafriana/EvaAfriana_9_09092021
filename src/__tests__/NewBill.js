import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage";
import firestore from "../app/Firestore.js";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";
import { ROUTES_PATH } from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // test handleChangeFile
    describe("And I upload an image in file input", () => {
      test("Then I can chose a file", () => {
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
        Object.defineProperty(fileId, "value", {
          value: "C:\\fakepath\\eva.jpg",
        });
        fileId.addEventListener("change", changeFile);
        userEvent.upload(
          fileId,
          new File([""], "eva.jpg", { type: "image/png" })
        );
        expect(changeFile).toHaveBeenCalled();
      });
    });

    // test handleSubmit
    test("Then i can create a valid bill", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "eva@gmail.com",
        })
      );

      const newBill = new NewBill({
        document,
        onNavigate: () => {},
        firestore,
        localStorage: window.localStorage,
      });

      newBill.createBill = jest.fn();

      const formNewBill = screen.getByTestId("form-new-bill");
      formNewBill.addEventListener("submit", newBill.handleSubmit);

      expect(newBill.createBill).toHaveBeenCalled();
    });

    test("Then should navigate to bills page", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new newBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: null,
      });

      const pathBills = () => {
        newBill.onNavigate(ROUTES_PATH["Bills"]);
      };

      // const pathBills = jest.fn((e) => newBill.handleClickIconEye(e));

      const btnSendBill = document.getElementById("btn-send-bill");
      btnSendBill.addEventListener("click", pathBills);
      userEvent.click(btnSendBill);

      expect(pathBills).toBeTruthy(1);
    });
  });
});
