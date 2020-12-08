exports.errorResponse = {
    messageTypeError: { status: "Error", data: { name: "MessageTypeError", detail: "Unexpected message type." } },
    unexpectedIDError: { status: "Error", data: { name: "UnexpectedIDError", detail: "Unexpected Client ID." } },
}

exports.normalResponse = (data) => ({ status: "OK", data: data })