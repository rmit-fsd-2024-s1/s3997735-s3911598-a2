

// credit card number just a string of numbers
export const validateCreditCardNumber = (cardNumber: string) => {
    const regex = new RegExp("^[0-9]{16}$");
    return regex.test(cardNumber);
};

//  'MM/YY'
export const validateExpiryDate = (expiryDate: string) => {
    const currentDate = new Date();
    const [month, year] = expiryDate.split('/').map(Number);
    // if they are not numbers --- return false
    if (!month || !year) return false;

    const expiry = new Date(year + 2000, month - 1, 1);
    return expiry > currentDate;
};

