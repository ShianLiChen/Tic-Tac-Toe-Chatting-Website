package com.example.webchatserver;

import java.io.*;
import java.util.ArrayList;

import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


// Class used to store all rooms and send a string containing all rooms created so far.
@WebServlet(name = "testing", value = "/testing")
public class Testing extends HttpServlet {
    // static variable that holds the list of rooms
    public static ArrayList<String> rooms = new ArrayList<>();

    // converts list of rooms to a string
    public String existingRooms() throws IOException {
        StringBuilder roomToString = new StringBuilder();
        for(String room : rooms) // Builds a string that contains all rooms separated by a comma.
                                 // room1,room2,room3...
        {
            roomToString.append(room).append(",");
        }
        return roomToString.toString();
    }
    // Sends the String containing all Rooms.
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // setting the response type
        response.setContentType("text/plain");

        // send the random code as the response's content
        PrintWriter out = response.getWriter();
        out.println(existingRooms());
    }

    // adds a room to the rooms list if the list doesn't already contain the room code
    public static void addRoom(String room)
    {
        if(!rooms.contains(room))
        {
            rooms.add(room);
        }
    }

    public void destroy() {
    }
}