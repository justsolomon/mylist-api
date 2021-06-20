const checkEmptyOrNullProps = (body, props) => {
  for (let i = 0; i < props.length; i++) {
    let message;
    //check if prop exists in body
    if (body[props[i]] === undefined) {
      message = `${props[i]} is required`;
    }
    //check if prop is empty
    else if (body[props[i]] === "") {
      message = `${props[i]} cannot be empty`;
    } else continue;

    return { status: "error", message };
  }

  return { status: "success", message: "No null or empty props found" };
};

module.exports = checkEmptyOrNullProps;
