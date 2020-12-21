exports.errorResponse = {
    messageTypeError: JSON.stringify({ type: "Error", data: { name: "MessageTypeError", detail: "Unexpected message type." } }),
    unexpectedClientIDError: JSON.stringify({ type: "Error", data: { name: "UnexpectedClientIDError", detail: "Unexpected Client ID." } }),
    unexpectedTrainIDError: JSON.stringify({ type: "Error", data: { name: "UnexpectedTrainIDError", detail: "Unexpected Train ID." } }),
}

exports.normalResponse = (type, data) => JSON.stringify({ type: type, data: data })

exports.normalResponse_object = (type, data) => ({ type: type, data: data })
