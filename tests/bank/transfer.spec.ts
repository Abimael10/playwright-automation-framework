import { test } from "../../src/fixtures/auth.fixture";
import type { TransferPage } from "../../src/pages/TransferPage";

test.describe("Bank Transfers @regression", () => {
  test.beforeEach(async ({ transferPage }: { transferPage: TransferPage }) => {
    await transferPage.goto();
  });

  test("should load transfer page correctly @regression", async ({ transferPage }: { transferPage: TransferPage }) => {
    await transferPage.assertLoaded();
  })

  test("should transfer from High Yield Service account to Everyday Checking Account for today @regression @functional", async ({ transferPage }: { transferPage: TransferPage }) => {
    //Step 1. Assert page is loaded
    await transferPage.assertLoaded();

    //Step 2. Select the account where the funds are going to be transferred from.
    await transferPage.selectFromAccount("High-Yield Savings — $12,800.00");

    //Step 3. Select the account where the funds are going to be transferred to.
    await transferPage.selectToAccount("Everyday Checking — $4,250.00");

    //Step 4. Fill the amount of the transfer
    await transferPage.fillAmount("100");

    //Step 5. Select the Today radio option
    await transferPage.selectTodayOption();

    //Step 6. Send the transfer for review and confirmation
    await transferPage.sendTransfer();

    //Step 7. Confirm transfer inside confirmation dialog
    await transferPage.assertConfirmDialogVisible();
    await transferPage.confirmTransfer();

    //Step 8. Confirm the transfer success
    await transferPage.assertTransferSuccess();
  });

  test("transfer form loads with from/to dropdowns @regression", async ({transferPage}: {transferPage: TransferPage}) => {
    await transferPage.assertLoaded();
    
    //Step 2. Select the account where the funds are going to be transferred from.
    await transferPage.selectFromAccount("High-Yield Savings — $12,800.00");

    //Step 3. Select the account where the funds are going to be transferred to.
    await transferPage.selectToAccount("Everyday Checking — $4,250.00");
  });

  test("same From Account cannot be selected as To Account @regression", async ({transferPage}: {transferPage: TransferPage}) => {
    await transferPage.assertLoaded();

    await transferPage.selectFromAccount("High-Yield Savings — $12,800.00");
    await transferPage.assertAccountFromAndToAccountNotEqual("High-Yield Savings — $12,800.00");
  });
});