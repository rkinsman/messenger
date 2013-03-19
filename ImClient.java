/**
 * Dave Toth (Adapted from Sun's Java Tutorial code)
 * This program is the client portion of a client-server pair.
 */

import java.io.*;
import java.net.*;

public class ImClient {

	public static void main(String[] args) throws IOException {

		Socket mySocket = null;
		PrintWriter out = null;
		BufferedReader in = null;
		BufferedReader me = null;

		try {
			mySocket = new Socket("rosemary.umw.edu", 2280);
			out = new PrintWriter(mySocket.getOutputStream(), true);
			in = new BufferedReader(new InputStreamReader(mySocket.getInputStream()));
			me = new BufferedReader(new InputStreamReader(System.in));
		} 
		catch (UnknownHostException e) {
			System.err.println("I couldn't find the host rosemary.umw.edu.");
			System.exit(1);
		} 
		catch (IOException e) {
			System.err.println("I/O exception with rosemary.umw.edu.");
			System.exit(1);
		}

		String fromServer;
		String stuff;;

		System.out.println("Welcome to Messenger! please enter a valid username: ");
		out.println(me.readLine());
		while ((fromServer = in.readLine()) != null) {
			System.out.println("~M~ " + fromServer);
			out.println(me.readLine());
		}
		System.out.println("closing socket!!!!!"); 
		out.close();
		in.close();
		mySocket.close();
	}
}
