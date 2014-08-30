var locale = function() {
    return {
        set: function(locale) {
            document.cookie = "locale=" + locale.toString();
            location.reload();
        },
        reset: function() {
            document.cookie = "locale=";
            location.reload();
        }
    };
};
