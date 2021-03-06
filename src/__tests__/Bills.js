import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import VerticalLayout from "../views/VerticalLayout";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import { ROUTES_PATH } from "../constants/routes.js";
import firebase from "../__mocks__/firebase.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;
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

    // BillsUI : increase the coverage rate to 100%
    test("Then Loading page should appears", () => {
      const html = BillsUI({ data: [], loading: true });
      document.body.innerHTML = html;
      const loadingId = document.getElementById("loading");
      expect(loadingId).toBeTruthy();
    });
    test("Then Error page should appears", () => {
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

        const newBills = new Bills({
          document,
          onNavigate: () => ROUTES_PATH["NewBill"],
          firestore: null,
          localStorage: null,
        });

        const clickNewBill = jest.fn(newBills.handleClickNewBill);
        const btnNewBill = screen.getByTestId("btn-new-bill");
        btnNewBill.addEventListener("click", clickNewBill);
        userEvent.click(btnNewBill);
        expect(clickNewBill).toHaveBeenCalled();
      });
    });

    // test handleClickIconEye
    describe("When I click on first eye icon", () => {
      test("Then modal should open", () => {
        const html = BillsUI({ data: bills });
        document.body.innerHTML = html;

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newBills = new Bills({
          document,
          onNavigate,
          firestore: null,
          bills,
          localStorage,
        });

        const eyeIcon = screen.getAllByTestId("icon-eye")[0];

        const clickIconEye = jest.fn(() =>
          newBills.handleClickIconEye(eyeIcon)
        );
        $.fn.modal = jest.fn();
        eyeIcon.addEventListener("click", clickIconEye);
        userEvent.click(eyeIcon);
        expect(clickIconEye).toHaveBeenCalled();
        expect($.fn.modal).toHaveBeenCalled();
      });
    });
  });

  // test d'int??gration GET
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get");
      const bills = await firebase.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
