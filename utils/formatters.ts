export const formatPhoneNumber = (phoneNumberString: string) => {
  //normalize string and remove all unnecessary characters
  phoneNumberString = ("" + phoneNumberString).replace(/[^\d]/g, "")

  //check if number length is at least 10, if longer strip off the end characters
  if (phoneNumberString.length >= 10) {
    //reformat and return US phone number
    return phoneNumberString
      .substring(0, 10)
      .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
  }

  //let them keep typing in their phone number
  return phoneNumberString
}

export const formatBVN = (phoneNumberString: string) => {
  //normalize string and remove all unnecessary characters
  phoneNumberString = ("" + phoneNumberString).replace(/[^\d]/g, "")

  //check if number length is at least 10, if longer strip off the end characters
  if (phoneNumberString.length >= 11) {
    //reformat and return US phone number
    return phoneNumberString
      .substring(0, 11)
      .replace(/(\d{3})(\d{3})(\d{4})/, "$1$2$3")
  }

  //let them keep typing in their phone number
  return phoneNumberString
}

export const formatFolioNumber = (folioNumberString: string) => {
  //normalize string and remove all unnecessary characters
  folioNumberString = ("" + folioNumberString).replace(/[^\d]/g, "")

  return folioNumberString
}

export const formatResetPasswordCode = (code: string) => {
  //remove all whitespaces
  code = ("" + code).trim()

  //check if number length is at least 10, if longer strip off the end characters
  if (code.length >= 7) {
    //reformat and return US phone number
    return code
      .substring(0, 6)
  }

  //let them keep typing in their phone number
  return code
}

export const formatUserName = (userNameString: string) => {
  //normalize string and remove all unnecessary characters
  userNameString = ("" + userNameString).replace("@", "").trim()

  //let them keep typing in their phone number
  return userNameString
}

export const formatSLots = (slots: string) => {
  //normalize string and remove all unnecessary characters
  slots = ("" + slots).replace(/\D/g,'').trim()

  //let them keep typing in their phone number
  return slots
}

export const formatAmount = (amount: string) => {
  //normalize string and remove all unnecessary characters
  amount = ("" + amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  //let them keep typing in their phone number
  return amount
}

export const formatAccountPhoneNumber = (phoneNumberString: string) => {
  //normalize string and remove all unnecessary characters
  phoneNumberString = ("" + phoneNumberString).replace(/[^\d]/g, "")

  //check if number length is at least 10, if longer strip off the end characters
  if (phoneNumberString.length >= 10) {
    //reformat and return US phone number
    return phoneNumberString
      .substring(0, 10)
      .replace(/(\d)(\d{3})(\d{3})(\d{3})/, "$1$2$3$4")
  }

  //let them keep typing in their phone number
  return phoneNumberString
}

export const formatVerificationCode = (verificationCodeString: string) => {
  //normalize string and remove all unnecessary characters
  verificationCodeString = ("" + verificationCodeString).replace(/[^\d]/g, "")

  //check if number length is at least 4, if longer strip off the end characters
  if (verificationCodeString.length >= 4) {
    //reformat and return US phone number
    return verificationCodeString
      .substring(0, 4)
      .replace(/(\d)(\d)(\d)(\d)/, "$1-$2-$3-$4")
  }

  //let them keep typing in their phone number
  return verificationCodeString
}
