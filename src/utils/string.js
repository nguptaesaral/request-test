export default {

    capitalize : function (str) {
        if (str === undefined) {
            return "";
        }
        str = str.toLowerCase()
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

};