#set page(margin: 50pt, height: auto, width: 8.5in, fill: rgb(40, 42, 54));
#set text(font:"FiraCode Nerd Font", fill:rgb(248, 248, 248));
#show raw: set text(font: "FiraCode Nerd Font", fill: rgb(248, 248, 248), size: 10pt);

#let category(name) = {
  align(center, text(weight:600, size:24pt, fill:rgb(80, 250, 123), name))
  line(length: 100%, stroke: 2pt + rgb(80, 250, 123))
  v(10pt)
}

#let subsection(name) = {
  text(weight:500, size:12pt, fill:rgb(139, 233, 253), name)
  linebreak()
  v(5pt)
}


#let endpoint(verb, path, description, status:(), body:(), form:())={
  box(fill:rgb(68, 71, 90), width: 100%, inset: 7pt, outset:(x: 25pt), radius: 8pt, {
    text(weight:800, size: 12pt, verb, fill: rgb(255, 121, 198))
    h(10pt);
    text(weight:600, size: 12pt, path)
    if (form.len() > 0) {
      for param in form {
        text(weight: 600, size: 12pt, "/");
        text(weight: 600, fill: rgb(241, 250, 140), param.at(0))
      }
      linebreak()
    }
  })
  linebreak()
  v(5pt)
  h(5pt)
  box(
    text(weight: 200, description)
  )
  v(5pt)
  if form.len() > 0 {
    subsection("Form Parameters")
    for param in form {
      h(10pt)
      text(weight: 600, fill:rgb(241, 250, 140), str(param.at(0)))
      text(weight: 400,  ": ")
      text(weight: 400,  param.at(1))
      v(0pt)
    }
    v(5pt)
  }
  if body.len() > 0 {
    subsection("Request Body")
    box(fill:rgb(30, 32, 40), width: 100%, inset: 20pt, radius: 12pt, {
    text(weight: 400, body.at(0), fill: rgb(200, 200, 200))
    linebreak()
    raw(lang:"json", body.at(1))
    })
    v(5pt)
  }
  if (status.len() > 0) {
    subsection("Status Codes")
    for code in status {
      h(10pt)
      text(weight: 600, fill:rgb(255, 184, 108), str(code.at(0)))
      text(weight: 400,  ": ")
      h(5pt)
      text(weight: 400,  code.at(1))
      v(0pt)
    }
  }
  v(30pt)
}

// rgb(189, 148, 249, 63)
#let infobox(text) = align(center, box(fill: rgb(30, 32, 40), inset: 15pt, radius: 15pt, align(left, text)));


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

#category("Authentication");
#endpoint(
  "POST",
  "/api/user",
  "Attempt to create a new user. If the user already exists or the email/password are invalid, the request will be rejected.",
  body:(
    "application/json",
    "
    \"email\": \"string\",
    \"password\": \"string\"
  "),
  status:(
    (201, "user created successfully"),
    (400, "invalid email/password, or user already exists"),
    (500, "internal server error"),
  )
)

#endpoint(
  "POST",
  "/api/session",
  "Attempt to log in as a user. If the user does not exist or the password is incorrect, the request will be rejected.",
  body:(
    "application/json",
    "
    \"email\": \"string\",
    \"password\": \"string\"
  "),
  status:(
    (201, "login successful"),
    (401, "invalid email/password"),
    (500, "internal server error"),
  )
)

#endpoint(
  "GET",
  "/api/session",
  "Returns 200 if the user is logged in.",
  status:(
    (200, "session information retrieved successfully"),
    (401, "user is not logged in"),
    (500, "internal server error"),
  )
)

#endpoint(
  "DELETE",
  "/api/session",
  "Attempt to log out the current user.",
  status:(
    (204, "logout successful"),
    (401, "user is not logged in"),
    (500, "internal server error"),
  )
)

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

#category("OpenAI")

#endpoint(
  "POST",
  "/api/image",
  "Use OpenAI to generate a list of ingredients from an image. Returns a JSON array of strings.",
  body:(
    "application/multipart-form-data",
    "
    \"image\": <image file>
    "
  ),
  status:(
    (200, "ingredients generated successfully"),
    (400, "invalid image file"),
    (401, "user is not logged in"),
    (429, "rate limit exceeded"),
    (500, "internal server error"),
  )
)

#endpoint(
  "GET",
  "/api/recipes",
  "User OpenAI to generate a list of recipe ideas based on the user's ingredients in the database. Returns a JSON array of strings.",
  status:(
    (200, "recipes generated successfully"),
    (400, "no ingredients in database"),
    (401, "user is not logged in"),
    (429, "rate limit exceeded"),
    (500, "internal server error"),
  )
)

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

#category("Lists");

#infobox([The list endpoints allows a client to manage their ingredient and preference lists.

The lists are named after the plural of the items they contain. For example, a list
of ingredients is named "ingredients", while a single entry in the list is called an "ingredient".

The endpoints that interact with a single item at a time are named using the singular of the list.
For example, to add a single ingredient to the "ingredients" list, the endpoint is
#v(0pt)
#align(center, text(weight: 800, "POST /api/ingredient/{ingredient}"))
#v(10pt)

The server currently supports the following lists, presented here in plural.
#align(center, box(align(left, [
- ingredients
- ingredient-exclusions
- recipe-exclusions
])))
])

#endpoint(
  "GET",
  "/api",
  "Retrieve a list of all strings in the corresponding database list.

  Example: GET /api/ingredients",
  form:(
    ("your-items", "the plural name of the list to retrieve"),
  ),
  status:(
    (200, "list retrieved successfully"),
    (401, "user is not logged in"),
    (500, "internal server error"),
  )
)

#endpoint(
  "PUT",
  "/api",
  "Add an array of new items to the database. The request body should be a JSON array of strings.

  Example: PUT /api/ingredients",
  form:(
    ("your-items", "the plural name of the list to add items to"),
  ),
  body:(
    "application/json",
    "
\"items\": [
    \"string\",
    \"string\",
    ...
]
  "),
  status:(
    (204, "items added successfully"),
    (400, "invalid data in request body"),
    (401, "user is not logged in"),
    (500, "internal server error"),
  )
)

#endpoint(
  "DELETE",
  "/api",
  "Delete a list of items from the corresponding database list.

  Example: DELETE /api/ingredients",
  form:(
    ("your-items", "the plural name of the list to delete items from"),
  ),
  body:(
    "application/json",
    "
\"items\": [
    \"string\",
    \"string\",
    ...
]"
  ),
  status:(
    (204, "items deleted successfully"),
    (400, "invalid data in request body"),
    (401, "user is not logged in"),
    (500, "internal server error"),
  )
)

#endpoint(
  "POST",
  "/api",
  "Add a single item to the list.

  Example: POST /api/ingredient/broccoli",
  form:(
    ("your-item", "the singular name of the list to add items to"),
    ("item", "the item to add"),
  ),
  status:(
    (204, "item added successfully"),
    (400, "invalid item name"),
    (401, "user is not logged in"),
    (500, "internal server error"),
  )
)

#endpoint(
  "PUT",
  "/api",
  "Update the name of an item in the list.",
  form:(
    ("your-item", "the singular name of the list to update items in"),
    ("item-name", "the item to update"),
    ("new-name", "the new name of the ingredient"),
  ),
  status:(
    (204, "item updated successfully"),
    (400, "invalid item name or new name"),
    (401, "user is not logged in"),
    (404, "item not found"),
    (500, "internal server error"),
  ),
)

#endpoint(
  "DELETE",
  "/api",
  "Delete an ingredient from the database.",
  form:(
    ("your-item", "the singular name of the list to delete items from"),
    ("ingredient", "the item to delete"),
  ),
  status:(
    (204, "ingredient deleted successfully"),
    (400, "invalid ingredient name"),
    (401, "user is not logged in"),
    (404, "ingredient not found"),
    (500, "internal server error"),
  ),
)
