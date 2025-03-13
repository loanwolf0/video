const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/i;
const onlyCharacterRegex = /^[a-zA-Z]+$/i;
const nameRegex = /^(?!\s)(?!\d)(?!.*[^a-zA-Z0-9\s]).*$/;
const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
const onlySpace = /^(?!\s*$).+$/
const onlySpaceRegex = /^(?!\s*$)[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
const onlySpaceOrSpecialCharRegex = /^(?!\s*$)[a-zA-Z0-9\s]+$/;
const noSpecialCharRegex = /^[a-zA-Z0-9\s]*$/;
const invalidDate =  /^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;

const strictNameRegex = /^(?!\s|[\d\W])[\w\s\W]+$/;
const leadingSpaceRegex = /^[^\s]/

const emailPattern = {
    value: emailRegex,
    message: 'Please enter valid email.'
}

const passwordPattern = {
    value: passwordRegex,
    message: "Password must include lowercase, uppercase, number, special character and min 8 length.",
};

const domainPattern = {
    value: onlyCharacterRegex,
    message: "Only character allowed",
};
const onlySpaceNotAllowed = {
    value: onlySpaceRegex,
    message: "Please enter valid name"
}
const onlySpaceOrSpecialCharNotAllowed = {
    value: onlySpaceOrSpecialCharRegex,
    message: "Only spaces or special characters are not allowed"
}

const addressPattern = {
    value: onlySpaceOrSpecialCharRegex,
    message: "Please enter valid address"
}

const namePattern = {
    value: nameRegex,
    message: "Only Space and Special Characters are not allowed"
}
const fieldPattern = /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*[^\s])?$/gu;
const numberPattern = /^(?!\d+\.$)(\d+(\.\d+)?)?$/;
const serialNumberRegx = /^[a-zA-Z0-9][a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*[^\s]?$|^\d+$/gu;

const panNumberPattern = {
    value: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
    message: 'Please add a valid pan number'
};

const websitePattern = {
    value: urlPattern,
    message: "Invalid Website Link"
}

const invalidDatePattern = {
    value: invalidDate,
    message: "Invalid Date"
}


// VALIDATIONS FOR MANUALLY VALIDATE

const customValidateSpecialChar = (value) => {
    return noSpecialCharRegex.test(value)
}
const isValidText = (text) => {
    const removeDivTag = text.slice(5,text.length-6);
    const normalizedText = removeDivTag.replace(/&nbsp;/g, ' ');
    return leadingSpaceRegex.test(normalizedText); 
  };

const strictNamePattern = {
    value: strictNameRegex,
    message: "Name cannot start with spaces, symbols, or numbers"
};

const subCategoryPattern = {
    value: onlySpaceOrSpecialCharRegex,
    message: "Please enter valid subcategory name"
}


export {
    customValidateSpecialChar, domainPattern, emailPattern, fieldPattern, invalidDatePattern, isValidText, namePattern,
    nameRegex, numberPattern, onlySpaceNotAllowed,
    onlySpaceOrSpecialCharNotAllowed, passwordPattern, strictNamePattern, websitePattern,
    serialNumberRegx,
    addressPattern,
    subCategoryPattern,
    panNumberPattern,
    onlySpace,
    emailRegex,
    urlPattern
};

