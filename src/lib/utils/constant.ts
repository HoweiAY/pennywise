import {
    HomeIcon,
    ArrowsRightLeftIcon,
    ChartPieIcon,
    UsersIcon,
    BellIcon,
} from "@heroicons/react/24/outline";

// Base URL for calling APIs in route handler
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

/*
    Country codes and corresponding names
    (Note: All country codes adhere to the ISO-3166-alpha-2 standard)
*/
export const countryCodes = {
    "AF": "Afghanistan",
    "AX": "Aland Islands",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua And Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BA": "Bosnia And Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "CV": "Cape Verde",
    "KY": "Cayman Islands",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands",
    "CO": "Colombia",
    "KM": "Comoros",
    "CG": "Congo",
    "CD": "Congo, Democratic Republic",
    "CK": "Cook Islands",
    "CR": "Costa Rica",
    "CI": "Cote D'Ivoire",
    "HR": "Croatia",
    "CU": "Cuba",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "ET": "Ethiopia",
    "FK": "Falkland Islands (Malvinas)",
    "FO": "Faroe Islands",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island & Mcdonald Islands",
    "VA": "Holy See (Vatican City State)",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran, Islamic Republic Of",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle Of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KR": "Korea",
    "KP": "North Korea",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libyan Arab Jamahiriya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MK": "Macedonia",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia, Federated States Of",
    "MD": "Moldova",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "AN": "Netherlands Antilles",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestinian Territory, Occupied",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "RE": "Reunion",
    "RO": "Romania",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "BL": "Saint Barthelemy",
    "SH": "Saint Helena",
    "KN": "Saint Kitts And Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin",
    "PM": "Saint Pierre And Miquelon",
    "VC": "Saint Vincent And Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome And Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia And Sandwich Isl.",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SJ": "Svalbard And Jan Mayen",
    "SZ": "Swaziland",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad And Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks And Caicos Islands",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom",
    "US": "United States",
    "UM": "United States Outlying Islands",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela",
    "VN": "Vietnam",
    "VG": "Virgin Islands, British",
    "VI": "Virgin Islands, U.S.",
    "WF": "Wallis And Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
};

// Currency codes and corresponding names accepted by PayPal
export const currencyData = {
    "AUD": "Australian dollar",
    "BRL": "Brazilian real",
    "CAD": "Canadian dollar",
    "CNY": "Chinese Renmenbi",
    "CZK": "Czech koruna",
    "DKK": "Danish krone",
    "EUR": "Euro",
    "HKD": "Hong Kong dollar",
    "HUF": "Hungarian forint",
    "ILS": "Israeli new shekel",
    "JPY": "Japanese yen",
    "MYR": "Malaysian ringgit",
    "MXN": "Mexican peso",
    "TWD": "New Taiwan dollar",
    "NZD": "New Zealand dollar",
    "NOK": "Norwegian krone",
    "PHP": "Philippine peso",
    "PLN": "Polish złoty",
    "GBP": "Pound sterling",
    "SGD": "Singapore dollar",
    "SEK": "Swedish krona",
    "CHF": "Swiss franc",
    "THB": "Thai baht",
    "USD": "United States dollar"
};

/*
    Transaction categories with IDs:
    - 1: Food and Drinks
    - 2: Groceries
    - 3: Health and Personal Care
    - 4: Housing
    - 5: Shopping
    - 6: Sports and Entertainment
    - 7: Travel and Transportation
    - 8: Utilities
    - 9: Others
    (Note: ID starts from one to avoid clashing with nullish value)
*/
export const transactionCategories = {
    1: { name: "Food and Drinks", titlePlaceholder: "Dinner at Five Guys 🍔", color: "#ec4899" },
    2: { name: "Groceries", titlePlaceholder: "Ingredients for chicken casserole 🍲", color: "#f9a8d4" },
    3: { name: "Health and Personal Care", titlePlaceholder: "Medicines for my fever 🤒", color: "#fb7185" },
    4: { name: "Housing", titlePlaceholder: "Paying off my mortgage 🏡", color: "#bfdbfe" },
    5: { name: "Shopping", titlePlaceholder: "New dress from Balenciaga 👗", color: "#38bdf8" },
    6: { name: "Sports and Entertainment", titlePlaceholder: "Movies with the boys 🎞️", color: "#2563eb" },
    7: { name: "Travel and Transportation", titlePlaceholder: "Flight to Mumbai ✈️", color: "#6d28d9" },
    8: { name: "Utilities", titlePlaceholder: "Electricity bill for next month ⚡", color: "#a855f7" },
    9: { name: "Others", titlePlaceholder: "My new transaction 💲", color: "#c4b5fd" },
};

// Budget categories with IDs, same as transaction categories but without placeholder for input fields
export const budgetCategories = Object.entries(transactionCategories)
    .reduce((categories: { [id: string]: { name: string, color: string } }, [id, categoryData]) => {
        categories[parseInt(id)] = { name: categoryData.name, color: categoryData.color };
        return categories;
    }, {});

export const navLinks = [
    { name: "Home", href: "/dashboard", urlRegex: /\/dashboard$/g, icon: HomeIcon },
    { name: "Transactions", href: "/dashboard/transactions", urlRegex: /\/dashboard\/transactions[\/.]*/g, icon: ArrowsRightLeftIcon },
    { name: "Budget", href: "/dashboard/budget", urlRegex: /\/dashboard\/budget[\/.]*/g, icon: ChartPieIcon },
    { name: "Friends", href: "/dashboard/friends", urlRegex: /\/dashboard\/friends[\/.]*/g, icon: UsersIcon },
];