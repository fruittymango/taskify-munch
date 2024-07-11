import validator from "validator";

const unsanitize = (value: string) => validator.unescape(value);

export default unsanitize;