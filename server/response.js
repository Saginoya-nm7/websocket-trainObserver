exports.errorResponse = {
    messageTypeError: { status: "Error", data: { name: "MessageTypeError", detail: "Unexpected message type." } },
    unexpectedClientIDError: { status: "Error", data: { name: "UnexpectedClientIDError", detail: "Unexpected Client ID." } },
    unexpectedTrainIDError: { status: "Error", data: { name: "UnexpectedTrainIDError", detail: "Unexpected Train ID." } },
}

exports.normalResponse = (data) => ({ status: "OK", data: data })