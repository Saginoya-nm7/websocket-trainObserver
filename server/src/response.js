exports.errorResponse = {
    messageTypeError: JSON.stringify({ status: "Error", data: { name: "MessageTypeError", detail: "Unexpected message type." } }),
    unexpectedClientIDError: JSON.stringify({ status: "Error", data: { name: "UnexpectedClientIDError", detail: "Unexpected Client ID." } }),
    unexpectedTrainIDError: JSON.stringify({ status: "Error", data: { name: "UnexpectedTrainIDError", detail: "Unexpected Train ID." } }),
}

exports.normalResponse = (data) => JSON.stringify({ status: "OK", data: data })
