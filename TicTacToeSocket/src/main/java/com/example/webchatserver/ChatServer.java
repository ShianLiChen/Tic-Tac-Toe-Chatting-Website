package com.example.webchatserver;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static com.example.util.ResourceAPI.saveChatRoomHistory;

@ServerEndpoint(value="/ws/{roomID}")
public class ChatServer {
    // keep track of number of users entering the chat room
    private static int user = 0;
    // Maps the username to the number entry in a room
    private static Map<String, Integer> userNumber = new HashMap<String, Integer>(); // Map<username, user number>
    // Maps session number to username
    private static Map<String, String> usernames = new HashMap<String, String>(); // Map<sessionID, username>

    // static means there is only 1 version of map
    // Maps userId to roomID
    private static Map<String, String> roomList = new HashMap<>();
    // Maps roomID to room log history
    private static Map<String, String> roomHistoryList = new HashMap<>(); // Map<roomID, message>

    @OnOpen
    public void open(@PathParam("roomID") String roomID, Session session) throws IOException, EncodeException {
        // puts userId into map with room ID
        roomList.put(session.getId(), roomID);  // Add the session (username) and roomID to the map.
        // adds room to room list in testing class in Testing.java
        Testing.addRoom(roomID);                // Calls static addRoom from Testing.java
        // checks whether room history list contains the room ID
        if(!roomHistoryList.containsKey(roomID)){
            // adds first message to roomHistoryList map
            roomHistoryList.put(roomID, roomID+" room created."); // Only put message if it hasn't been put yet.
        }
        // sends the server opening message to be logged
        session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server ): Welcome to the chat room. Please state your username to begin.\"}");
    }

    @OnClose
    public void close(Session session) throws IOException, EncodeException {
        // initialized user and room IDs
        String userId = session.getId();
        String roomID = roomList.get(userId);
        // checks whether usernames map has the userID
        if (usernames.containsKey(userId)) {
            // initializes username
            String username = usernames.get(userId);
            // removes userID from the usernames map when person leaves room
            usernames.remove(userId);
            // adds the status of the room in the roomHistoryList map
            String logHistory = roomHistoryList.get(roomID);
            roomHistoryList.put(roomID, logHistory+"\\n " + username + " left the chat room.");
            // counts the number of peers in the open session
            int counterPeers = 0;  // Counter of users in the room.
            for (Session peer : session.getOpenSessions()){ //broadcast this person left the server
                // checks whether roomList map has the peers ID
                if(roomList.containsKey(peer.getId()))
                {
                    // checks whether the roomID for the peer matches the user's room ID
                    if(roomList.get(peer.getId()).equals(roomID)) {
                        // sends message to the peers in the session
                        peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): " + username + " left the chat room.\"}");
                        // counts the number of peers
                        counterPeers++;
                    }
                }
            }
            // if there are no more users in the room will save the log of the chat room to an API
            if(!(counterPeers>0)) // If there's no users, save the chatlog.
            {
                saveChatRoomHistory(roomID, roomHistoryList.get(roomID));
            }
        }
    }

    @OnMessage
    public void handleMessage(String comm, Session session) throws IOException, EncodeException {
        // initializes the user and room ID
        String userID = session.getId();
        String roomID = roomList.get(userID);
        // creates a json Object from the messages sent back by the client side
        JSONObject jsonmsg = new JSONObject(comm);
        String type = (String) jsonmsg.get("type");
        String message = (String) jsonmsg.get("msg");

        if (usernames.containsKey(userID)) { // not their first message
            String username = usernames.get(userID);
            System.out.println(username);
            // adds user messages to the roomHistoryList map
            String logHistory = roomHistoryList.get(roomID); // Grabs current chatLog
            roomHistoryList.put(roomID, logHistory+"\\n " + "(" + username + "): " + message); // concats the new message to the existent chatLog
            // shows all the current users in the room if the user types "/users"
            if(message.equals("/users"))
            {
                usersCommands(session);
            }
            // produces a normal message if message does not equal "/users"
            else
            {
                normalMessage(session, roomID, username, message);
            }

        } else { //first message is their username
            // adds userId and username to usernames map
            usernames.put(userID, message);
            // sends welcome message
            session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server ): Welcome, " + message + "!\"}");
            // keeps track of the order of which users entered the room (i.e., first, second, third user)
            user += 1;
            // assigns user number to username
            userNumber.put(message, user);

            // adds message record to roomHistoryList map
            String logHistory = roomHistoryList.get(roomID);
            roomHistoryList.put(roomID, logHistory+"\\n " + message + " joined the chat room.");
            // sends the first message to the user
            firstMessage(session, userID, roomID, message);

        }
    }

    // Function for the firstMessage of a user.
    public void firstMessage(Session session, String userID, String roomID, String message) throws IOException {
        for(Session peer: session.getOpenSessions()){
            // broadcasts entry message to peers in the same room as the user
            if(!peer.getId().equals(userID) && (roomList.get(peer.getId()).equals(roomID))){
                peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): " + message + " joined the chat room.\"}");
            }
        }
    }

    // Function for a normalMessage (any message after firstMessage), or that is not a command.
    public void normalMessage(Session session, String roomID, String username, String message) throws IOException {
        for(Session peer: session.getOpenSessions()){
            // checks room list for peerID and whether the peer's roomID matches the user's roomID
            if(roomList.containsKey(peer.getId()))
            {
                if(roomList.get(peer.getId()).equals(roomID))
                {
                    // gets the user number from the map
                    int userNum = userNumber.get(username);
                    // sends message to the client side
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"user\": \""+userNum+"\", \"message\":\"(" + username + "): " + message+"\"}");
                }
            }
        }
    }
    // Function for when "/users" command is used.
    public void usersCommands(Session session) throws IOException {
        // returns the usernames of users currently in the same room
        StringBuilder stringB = new StringBuilder();
        for(String user : usernames.values())
        {
            stringB.append(user).append(",");
        }
        stringB.deleteCharAt(stringB.length() - 1);
        session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\" Users In Room: " + stringB.toString() + "!\"}");
    }
}