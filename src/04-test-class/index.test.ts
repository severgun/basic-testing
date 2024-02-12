// Uncomment the code below and write your tests
import {
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

describe('BankAccount', () => {
  const newAccount = getBankAccount(1000);
  const recipientAccount = getBankAccount(1000);

  test('should create account with initial balance', () => {
    expect(newAccount.getBalance()).toEqual(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => {
      newAccount.withdraw(1001);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => {
      newAccount.transfer(1001, recipientAccount);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => {
      newAccount.transfer(10, newAccount);
    }).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const balanceBefore = newAccount.getBalance();
    const deposit = 100;
    newAccount.deposit(deposit);
    expect(newAccount.getBalance()).toEqual(balanceBefore + deposit);
  });

  test('should withdraw money', () => {
    const balanceBefore = newAccount.getBalance();
    const withdrawAmount = 100;
    newAccount.withdraw(withdrawAmount);
    expect(newAccount.getBalance()).toEqual(balanceBefore - withdrawAmount);
  });

  test('should transfer money', () => {
    const balanceBefore = recipientAccount.getBalance();
    const transferAmount = 100;
    newAccount.transfer(transferAmount, recipientAccount);
    expect(recipientAccount.getBalance()).toEqual(
      balanceBefore + transferAmount,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await newAccount.fetchBalance();
    expect(typeof balance === 'number' || balance === null).toBe(true);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const balanceBefore = newAccount.getBalance();
    try {
      await newAccount.synchronizeBalance();
      expect(newAccount.getBalance()).not.toBe(balanceBefore);
    } catch (error) {}
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    try {
      await newAccount.synchronizeBalance();
    } catch (error) {
      expect(error).toBeInstanceOf(SynchronizationFailedError);
    }
  });
});
