<h1> A REST API - Todo-app </h1>
API:- https://note-todo-api.herokuapp.com/

#
```diff
NOTE
To interact with Todo API all the essential requirement are pre-installed like:
1. CROS(cross resource origine service) - Hence any browser can access this API regardless of 
    Cross Resource Origine Policy of browser.
2. JWT (JSON Web Token) - To authenticate the user by token system.
```
#

# Features
1. User-id and password are required to authenticate user
2. search todo by user name
3. search todo by todo's id (every todo have their own id)
4. Follow the Principle of Restfull API.
5. Use MongoDB as database (No setup required)
6. Using JSON to exchange data 

# How it work
At first user need to create an user-id and password, after sucessfull creation a token is generated for that user.
And when user get logout token are deleted. Again a new token is generated when a user sign-in.
For every route this token is required to authenticate the user and it must be send to server along with headers.

# Registering a new user
Route:- '/users'</br>
Method:- POST</br>
To register a new user, You need to send a request along with body in JSON form,  A JSON consist of key:value pair  
where keys are 'email' and 'password' and value are a valid email-id and password. 
eg:-
{
    "email"    : "example@mail.com",
    "password" : "[Your password]"
}

After sending the above request, server will save the user in Database and respond back with a token. 
This token is in response header and store as a key:value pair where key is x-auth.

# verifying token or user manually
Route:- 'users/me'</br>
Method:- GET</br>
If you want to verifiy a token or want to get a user from token. send back the token (token of sign-in user) in request header as a key:value pair where key will be x-auth and value [generated token]. Server will response with an user object (in JSON form)

# sign-in 
Route:- '/users/login'</br>
Method:- POST</br>
Follow the same of # Registering a new user, but this time use the above route. server will response with user object inside body and a token in response header 

# sign-out
Route:- '/users/me/token'</br>
Method:-DELETE</br>
Follow the same of # Verifying token or user manually, but use the above route And server will response with status code 200.

#
```diff
Note:- Below are the todos realted route and every route required token, 
so set token in request header for all route 
```
# 

# Add a new todo
Route:-'/todos'</br>
Method:-POST</br>
To add a new todo send a request with body in JSON form where key will be text:[your text]. Server will response with JSON data.
explaintion of response JSON data 
{
    "_id"         : "[randomly generated id]"
    "text"        : "[text that you provide]",
    "completed"   :"[true, false]",
    "completedAt" :"[time of completion]",
    "_creator"    : "[id of logged user]"
} 

# List all todo
Route:- '/todos'</br>
Method:-GET</br>
Just send a get request to above route (keep in mind that x-auth is already set in header). Server will respone with JSON data containig
all todos of logged-in user

# Find todo by id
Route:- '/todos/:id [Pass id of todo]'</br>
Method:-GET</br>
Grab the _id of one of your todos and send it with request parameter. server will response 
with single todo if todo found with that id otherwise send 404 status code

# Delete todo
Route:-'/todos/:id[todo id] '</br>
Method:-DELETE</br>
Use _id of one of your todos and send it with request parameter. server will response
with deleted todo if todo found with that id otherwise send 404 status code

# Update todo
Route:-'/todos/:id [todo id]'</br>
Method:-PATCH</br>
By using  _id of one of your todos you can easily update todo just send the _id in request parameter and a JSON body
Where key will be 'text' and 'completed'
eg:-
{
    "text"      : "[updated text]",
    "completed" : "[true or false]"
}
And server will respond with updated todo if todo found with that id otherwise send 404 status code




