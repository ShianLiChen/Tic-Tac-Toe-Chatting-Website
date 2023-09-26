# Project Information
### Contributors
* Shian Li Chen
* Johnny Liang
* Kevin Jiang
* Daniel Shklyarman 

### Description
This is an implementation of a website through which 2 or more people can play Tic Tac Toe and talk to each other simultaneously. Users can also just talk to each other through the dedicated chat page. Websockets, Java, HTML, CSS and JavaScript were used to create the Tic Tac Toe game logic, the GUI (graphical user interface) and the web sockets that allow multiple users to play against each other. A Chat Resource RESTful API was also created, using Java and Maven, that stores the chat logs and saves them as JSON files to be viewed later.   

The website's home page allows one to access the game as well as the other web pages, including the dedicated chat room, the instructions page which contains the instructions on how to use the website, and the contacts page which contains the list of contributors and their GitHub profiles.

##### Home 
![Final - Home](https://user-images.githubusercontent.com/123001931/232151942-a5d673cc-7d8b-48cc-9257-66a68513403d.JPG)

##### Game (3x3 and 4x4)
![Final - Game](https://user-images.githubusercontent.com/90335714/232172586-c4669447-882e-43da-bd37-7d4aa1020267.png)
![Final - 4x4](https://user-images.githubusercontent.com/90335714/232176639-85b45fe6-4669-4c60-9282-af6542799360.png)

##### Chat 
![Final - Chat Users](https://user-images.githubusercontent.com/90335714/232172552-66054058-d414-4e87-8f0c-d04123a2ee84.png)
![Final - Chat](https://user-images.githubusercontent.com/90335714/232172487-d9471187-0d57-4c9d-bbc8-9c80a022f185.png)


##### Instructions
![Final - Instructions](https://user-images.githubusercontent.com/90335714/232162587-aeacc96c-c2f9-4c3a-a602-fbd9cda81102.png)


##### Contact
![Final - Contact](https://user-images.githubusercontent.com/123001931/232152042-3a207bd5-1d56-495b-9ec2-dd54d0feb954.JPG)

# How to Run
1. Clone the repository into a folder of your choice using git clone and the url for this GitHub page. This repository has 2 folders: one for the Chat History API and the other for the Chat Server/Tic Tac Toe Web Socket.
(Make sure that the folder name has no spaces in it)

2. Open IntelliJ and select 'Open'.

3. Navigate to your cloned project folder folder and select the ChatResourceAPI as the project to open.

4. Set up your Glassfish configurations by selecting the drop down next to the green hammer icon on IntelliJ (by default it should be on Current File). ![image](https://user-images.githubusercontent.com/90335714/225509626-02f4b242-5a27-4b23-b8e3-d7f37ea3ef41.png) <br><br>You then add a new configuration using the add symbol and selecting the glassfish **local** server option. The configurations should be changed to match the first image below. Also make sure to add the ChatResourceAPI war **exploded** artifact under the 'Deployment' tab (shown in the second image).
![CSCI2020U Final Project, API Glassfish Config](https://user-images.githubusercontent.com/90335714/232163091-09c9bfa5-7d96-4e5e-b571-caf106fc1d31.png)
![CSCI2020U Final Project, API Artifact](https://user-images.githubusercontent.com/90335714/232163150-2e386478-64ec-433e-a419-2b5cdfa68a0d.png)

5. Once you have set up the configurations run the GlassFish local server by pressing the green play button. This may take a couple moments to load. Once it loads, you'll be automatically taken to a new Chrome tab that will display "Hello, World". Similar to the image below:
![CSCI2020U Final Project, API Page](https://user-images.githubusercontent.com/90335714/232163947-e0fd9425-2d3a-4a59-8074-fd5ab53d88fa.png)

6. Next select 'Open' in the file tab of the IntelliJ window.

7. Navigate to your cloned project folder folder and this time select the TicTacToeSocket as the project to open.

8. Set up your Glassfish configurations by selecting the drop down next to the green hammer icon on IntelliJ (by default it should be on Current File). ![image](https://user-images.githubusercontent.com/90335714/225509626-02f4b242-5a27-4b23-b8e3-d7f37ea3ef41.png) <br><br>You then add a new configuration using the add symbol and selecting the glassfish **remote** server option. The configurations should be changed to match the first and second images below. Also make sure to add the TicTacToeSocket war artifact **(not the exploded artifact)** under the 'Deployment' tab (shown in the third image).
![CSCI2020U Final Project, WS Glassfish Config pt1](https://user-images.githubusercontent.com/90335714/232163532-3c5a3062-a799-46ca-b434-1d6ff0229dd1.png)
![CSCI2020U Final Project, WS Glassfish Config pt2](https://user-images.githubusercontent.com/90335714/232163640-b62f8802-9b04-49d8-9906-0b1b272bec09.png)
![CSCI2020U Final Project, WS Artifact](https://user-images.githubusercontent.com/90335714/232163668-028b9165-65c3-4586-b9e5-86311728a636.png)

9. Once you have set up the configurations run the GlassFish remote server by pressing the green play button. This may take a couple moments to load. Once it loads, you'll be automatically taken to a new Chrome tab that will have the Home page open.

10. After you press run you will be taken to the home page. Using the choices on the top you can navigate between the Home, Chat, Instructions, and Contact pages.

![CSCI2020U Final Project, Navigation](https://user-images.githubusercontent.com/123001931/232117226-e29ba692-81e0-4cec-bdbd-8a32b8f5d7f4.PNG)

11. As this runs on a remote server, in order to have multiple people join games/chat rooms, simply open up another tab and go to the same URL (http://localhost:8080/WSChatServer-1.0-SNAPSHOT/index.html#home). Every individual tab will have it's own 'user'. <br><br>Make sure to clear the game by having each user press 'New Game' in their tab before starting another game. <br>While there is no max limit for the number of users in a room, there shouldn't be more than 2 in order for the game to be played properly.

### Playing a Game Instructions
1. Once you have the home page open and running you can select the play button to play a game. This will take you to a page that looks like the image below:
![image](https://user-images.githubusercontent.com/90335714/232172634-b825edc7-b3df-4cf3-a426-d316df001421.png)

2. Once on the game page you can click the enter button on the left to enter a new chat room.
![image](https://user-images.githubusercontent.com/90335714/232172648-e1cf4bb0-e303-4d14-af3c-ec28ebbe2256.png)

3. After pressing the enter button the web page would change to the page as shown below:

![image](https://user-images.githubusercontent.com/90335714/232172671-1e814fd7-de4f-4a05-a5e4-8ce9987b78b5.png)

4. In the input area of the chat log, add your username that you will be referred as. 
![image](https://user-images.githubusercontent.com/90335714/232172706-5afc08c0-32a3-4c08-bfe7-560f70cf3c38.png)

5. Now that one user has been set up, you can copy and paste the URL (http://localhost:8080/WSChatServer-1.0-SNAPSHOT/game.html) into another Chrome tab. This will take you to a page similar to the image shown in step 1. 

6. In order to join the room of the first user, type the appropriate room code in the "Enter room code ..." input on the left. The available room codes are listed in the list of chat rooms. Once the code is entered press the enter button below the code input. Your webpage should be changed such that you are now in the appropriate chat room and the chat log is asking for you username. 

![image](https://user-images.githubusercontent.com/90335714/232172741-6edc2f98-590b-460c-a9d4-f2235bdce957.png)
![image](https://user-images.githubusercontent.com/90335714/232172761-f5629dd5-955a-4b20-af80-d268807bf233.png)

7. To make sure you are in the right chat room you can type `/users` in the input ad the chat log will return the users currently in the chat room. 
![image](https://user-images.githubusercontent.com/90335714/232172781-7fa761c4-b785-4433-b71f-cfbd14e60c91.png)

8. Once both of the users are ready, you can start clicking in the tic tac toe board to make your move. The moves you make will show up on the opponents game board along with a message in the chat log showing where you placed your piece. It will be in the form: "Your Turn: Move(11)" where the numbers in the brackets after the Move word represent the location of the cell that the opponent has selected in the order row and then column. For example the Move(11) represents that the user placed a piece in the first row and column. The piece that a user places will be based on when they entered the room. If you entered the room first your piece will be "O" and if you entered the room second your piece will be "X".
![image](https://user-images.githubusercontent.com/90335714/232172810-a3fcbf62-75c2-4aa0-afbc-1f367951ba4c.png)

9. Be sure to note that there is no restriction on how many moves you can play at one time, so make sure you stick by the normal Tic Tac Toe rules and play only one piece at a time. As well, if you would like to rematch your opponent both users would have to press the New Game button below the Tic Tac Toe board so that both users' boards will be cleared and a new game can be played. 

10. Once both users are done playing, they can close the tab and the user leaving will be displayed to the chat log. Once both users have left 2 new players can join the room and start playing against each other by following steps 1-6 again. Once the room is empty, the chat log history will be saved as a JSON by the API.

### Accessing API Chat History Instructions
1. In order to view the chat history you need to go to the page produced by step 5 in the How to Run instructions. Make sure to remember the room code that you were in.
![image](https://user-images.githubusercontent.com/90335714/232168673-0b5ea027-6c2d-483f-9f5b-f36977996954.png)

2. In this new page, you just need to add the room code that you were in to the end of the URL. Similar to how it looks in the image below:
![image](https://user-images.githubusercontent.com/90335714/232168815-a4b464e1-fd74-4c00-a2ad-8dc85dda629d.png)

3. Once you press enter and no one is in the chat room, you will see a log of what happened in the room. This will include user messages as well as user game moves, game outcomes and user states.
![image](https://user-images.githubusercontent.com/90335714/232168925-ad5e10ee-12d3-4287-a472-e4b09c4de73f.png)

4. In order to view the JSON file created in the IntelliJ IDE, go to the IntelliJ tab that is running the ChatResourceAPI folder and in the project file viewer (left side) press the following folders to expand them: target>ChatResourceAPI-1.0-SNAPSHOT>WEB-INF>classes>chatHistory. Once these folders are expanded you can look for you room code and open the JSON file. Opening the JSON file will show you the chat history log, similar to what is seen below: 
![image](https://user-images.githubusercontent.com/90335714/232169339-a20aa22d-8504-4851-9fb7-a89ea793020d.png)

# Other Resources

https://fontawesome.com/icons

This font awesome library was used to add icons that added to the aesthetics of the UI.

https://github.com/OntarioTech-CS-program/W23-LectureExamples

Inspiration for some of the code was drawn from the lecture examples shown above.

Link to original team repo that has some of the work up until April 14th at 11:00pm: https://github.com/ShianLiChen/Tic-Tac-Toe-Group-20-Project
