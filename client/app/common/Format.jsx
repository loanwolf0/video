import { useStore } from "../providers/StoreContext";
import MomentTimezone from 'moment-timezone';
import { removeDialCode, guessCountryByPartialPhoneNumber } from 'react-international-phone';

const FormatDateTime = ({ date, format = 'DD MMM yyyy hh:mm A' }) => {
    const { store } = useStore()

    const timezone = store?.user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!date) return "";
    let _date = new Date(date)
    return _date instanceof Date && !isNaN(_date) ? MomentTimezone.tz(date, timezone).format(format) : ""
}

const FormatDateTimeWithoutTimezone = ({ date, format = 'DD MMM yyyy hh:mm A' }) => {
    if (!date) return "";
    let _date = new Date(date)
    return _date instanceof Date && !isNaN(_date) ? MomentTimezone(_date).utc().format(format) : ""
}

const FormatPhoneNumber = ({ phone }) => {
    const country = guessCountryByPartialPhoneNumber({ phone })

    const formatPhone = (phone, format) => {
        let cleanedPhone = phone.replace(/\D/g, ''); // Remove non-numeric characters

        const _format = format?.default || format
        // Replace each '.' in the format with a corresponding digit from the phone number
        return _format.replace(/\./g, () => {
            const digit = cleanedPhone.charAt(0) || ''; // Get the first digit
            cleanedPhone = cleanedPhone.slice(1); // Update cleanedPhone to remove the first digit
            return digit; // Return the digit to replace '.'
        });
    }

    if (country.fullDialCodeMatch && country.country.format)
        return `+${country.country.dialCode} ${formatPhone(removeDialCode({ phone, dialCode: country.country.dialCode }), country.country.format)}`
    else
        return phone
}
export {
    FormatDateTime,
    FormatPhoneNumber,
    FormatDateTimeWithoutTimezone,
}