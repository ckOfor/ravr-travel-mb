import {locale} from 'expo-localization';

import i18n from "i18n-js";

const en = require("./en");

i18n.locale = locale;
i18n.fallbacks = true;
i18n.translations = { en };

export default i18n
