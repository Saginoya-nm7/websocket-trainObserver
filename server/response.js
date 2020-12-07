exports.errorResponse = {
    messageTypeError: { status: "Error", data: { name: "MessageTypeError", detail: "Unexpected message type." } }
}

exports.normalResponse = (data) => { return { status: "OK", data: data } }