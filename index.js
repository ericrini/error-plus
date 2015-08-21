var os = module.require('os');
var util = module.require('util');

/**
 * A wrapper to easily create robust Error objects. This can be called with or without a "new" operator.
 * @param cause {Error} The source error to wrap. (optional)
 * @param name {String} The error type name.
 * @param message {String} The error message, which can use util.format style placeholders.
 * @param args {String...} Additional arguments to replace the util.format placeholders.
 * @returns {Error}
 * @constructor
 */
var ErrorPlus = function () {
    Error.captureStackTrace(this, arguments.callee);

    var args = Array.prototype.slice.call(arguments);
    this.causes = [];

    if (args[0] instanceof Error && args[0].causes) {
        this.causes = args[0].causes;
    }

    if (args[0] instanceof Error) {
        this.causes.unshift(args[0]);
        args = args.slice(1);
    }

    this.name = args[0];
    args = args.slice(1);

    this.message = util.format.apply(util, args);

    /**
     * Format the error into a string.
     * @returns {String} A formatted string with the complete error details.
     */
    this.format = function () {
        var message = this.stack;

        this.causes.forEach(function (cause) {
            message += os.EOL + cause.stack;
        });

        return message;
    };
};

util.inherits(ErrorPlus, Error);

module.exports = ErrorPlus;