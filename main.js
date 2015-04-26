/*
 * © 2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

const RegionFormat = function(aMainLanguage, aBeforeCurrencySymbol, aCurrencySpacing, aMonetarySeparatorSymbol, aMonetaryGroupingSeparatorSymbol) {
    this.mainLanguage = aMainLanguage;
    // true = #,##0.00 ¤
    this.beforeCurrencySymbol = aBeforeCurrencySymbol;
    this.currencySpacing = aCurrencySpacing;
    this.monetarySeparatorSymbol = aMonetarySeparatorSymbol;
    this.monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol;
};

const regionFormats = {};

const makeRegionFormat = (region, mainLanguage) => {
    "use strict";

    const handleResult = (err, result) => {
        let beforeCurrencySymbol = true;
        let currencySpacing = " ";
        let monetarySeparatorSymbol = ",";
        let monetaryGroupingSeparatorSymbol = " ";
        let patternString = "#,##0.00 ¤";
        let ldml = {};
        let numbers = [];
        let currencyFormats = [];
        let currencyFormatLength = [];
        let currencyFormat = [];
        let pattern = [];
        if (result) {
            if (ldml = result.ldml) {
                if ((numbers = ldml.numbers) && numbers[0]) {
                    if ((currencyFormats = numbers[0].currencyFormats) && currencyFormats[0]) {
                        if ((currencyFormatLength = currencyFormats[0].currencyFormatLength) && currencyFormatLength[0]) {
                            if ((currencyFormat = currencyFormatLength[0].currencyFormat) && currencyFormat[0]) {
                                if ((pattern = currencyFormat[0].pattern) && pattern[0]) {
                                    patternString = pattern[0];
                                }

                            }

                        }

                    }
                    beforeCurrencySymbol = patternString.substr(0,1) !== "¤";
                    var theMatch;
                    if (theMatch = patternString.match("^¤[ \u00A0]?")) {
                        currencySpacing = theMatch[0].length > 1 ? theMatch[0].charAt(1) : "";
                    }
                    else if (theMatch = patternString.split("").reverse().join("").match("¤[ \u00A0]?")) {
                        currencySpacing = theMatch[0].length > 1 ? theMatch[0].charAt(1) : "";
                    }
                    if (numbers[0].symbols && numbers[0].symbols[0]) {
                        if(numbers[0].symbols[0].decimal && numbers[0].symbols[0].decimal[0]) {
                            monetarySeparatorSymbol = numbers[0].symbols[0].decimal[0];
                        }
                        if(numbers[0].symbols[0].group && numbers[0].symbols[0].group[0]) {
                            monetaryGroupingSeparatorSymbol = numbers[0].symbols[0].group[0];
                        }
                    }
                }
            }
        }
        regionFormats[region] = new RegionFormat(mainLanguage, beforeCurrencySymbol, currencySpacing, monetarySeparatorSymbol, monetaryGroupingSeparatorSymbol);
        console.log("region " + region);
        console.log(Object.keys(regions).length);
        console.log(Object.keys(regionFormats).length);
        if (Object.keys(regionFormats).length >= Object.keys(regions).length) {
            console.log(JSON.stringify(regionFormats));
        }
    };
    // Node.js
    const http = require("http");

    const url = "http://unicode.org/repos/cldr/tags/release-27-0-1/common/main/" + mainLanguage + ".xml";
    let body = "";
    const client = http.get(url, (res) => {
        console.log("Got statusCode: " + res.statusCode);
        if (res.statusCode !== 200) {
            console.log(url);
        }
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            const xml2js = require("xml2js");
            const parsed = xml2js.parseString(body, handleResult);
        });
    }).on("error", (e) => {
        console.error("Got error: " + e.message);
    });
};

const regions = require("./regions.json");

console.log(JSON.stringify(regions));

Object.keys(regions).forEach(function(element, index, array) {
    "use strict";
    makeRegionFormat(element.toLocaleLowerCase(), regions[element]);
});

