import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
// import VerticalLayout from "../views/VerticalLayout";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import { ROUTES_PATH } from "../constants/routes.js";
// import { localStorageMock } from "../__mocks__/localStorage.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      //to-do write expect expression
      // const icon = screen.getByTestId("icon-window");
      // expect(icon).toHaveClass("active-icon");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [], loading: true });
      document.body.innerHTML = html;
      const loadingId = document.getElementById("loading");
      expect(loadingId).toBeTruthy();
    });
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [], error: true });
      document.body.innerHTML = html;
      let errorId = document.querySelectorAll("[data-test-id=error-message]");
      expect(errorId).toBeTruthy();
    });

    // test handleClickNewBill
    describe("And I click on new bill button", () => {
      test("then should navigate to new bills page", () => {
        const html = BillsUI({ data: [] });
        document.body.innerHTML = html;

        const handleNewBill = new Bills({
          document,
          onNavigate: () => ROUTES_PATH["NewBill"],
          firestore: null,
          localStorage: null,
        });

        const clickNewBill = jest.fn(handleNewBill.handleClickNewBill);
        const btnNewBill = screen.getByTestId("btn-new-bill");
        btnNewBill.addEventListener("click", clickNewBill);
        userEvent.click(btnNewBill);
        expect(clickNewBill).toHaveBeenCalled();
      });
    });

    // test handleClickIconEye
    describe("And I click on first eye icon", () => {
      test("A modal should open", () => {
        const html = BillsUI({ data: bills });
        document.body.innerHTML = html;

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const handleNewBill = new Bills({
          document,
          onNavigate,
          firestore: null,
          localStorage: null,
        });

        const handleClickIconEye = jest.fn(handleNewBill.handleClickIconEye);
        const iconEye = screen.getAllByTestId("icon-eye");
        iconEye.forEach((eye) => {
          eye.addEventListener("click", handleClickIconEye);
          userEvent.click(eye);
          expect(handleClickIconEye).toHaveBeenCalled();
        });
      });
    });
  });
});
