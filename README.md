# Lost and Found
Welcome to our Lost and Found Website! This platform is designed to help users report lost items, search for found items, and facilitate the reunification of lost belongings with their owners. Whether you've misplaced your keys, left your umbrella behind, or found a lost pet wandering the streets, our website aims to connect people and lost items efficiently.

### Features

Report Lost Items(Add New Item): Users can easily submit details about their lost items, including descriptions, locations, and contact information.

Search for Found Items: Browse through the listings of found items to see if your lost belonging has been recovered by someone in the community and filter it out for different category, including Phone, Wallet, Other.

Contact Owners: If you find an item that matches what you've lost, you can reach out to the owner with the contact information provided on our platform to arrange for its return.

User Profiles: Create a profile to keep track of the items you've lost or found, manage your listings, and streamline communication with other users.

Check for the lost items you uploaded(My Items): Keep track of the items you've found, ensuring smooth coordination and communication throughout the process of reuniting items with their owners.

Check for the items that you claimed(My Claims): Easily review the items you've claimed as probably yours to monitor their status and any updates.


### Getting Started
To get started with our Lost and Found Website, follow these steps:

1. Sign Up: Create an account on our platform to access all the features. If you already have an account, simply log in.
2. Report Lost Items: If you've lost something, click on the "Report Lost Item" button and fill out the form with details about your lost item.
2. Search for Found Items: Browse through the listings of found items to see if someone has found what you're looking for.
3. Contact Owners: If you find a match, you can contact the owner directly through our messaging system to arrange for the return of the item.
4. Update Listings: If you've found your lost item or if an item you've found has been claimed, remember to update your listing to keep the database accurate.

### Database
Our Lost and Found Website utilizes a relational database to manage users, items, and claims efficiently. Below is a description of the database schema:

#### Users Table
The Users table stores information about registered users of the platform.

- user_id: Unique identifier for each user (Primary Key).
- username: Username chosen by the user (Unique, Not Null).
- password: Encrypted password for user authentication (Not Null).
- contact_info: Contact information provided by the user (Not Null).

#### Items Table
The Items table keeps track of lost and found items reported by users.

- item_id: Unique identifier for each item (Primary Key).
- type: Type or category of the item (e.g., Phone, Wallet, Other) (Not Null).
- location: Location where the item was found or lost (Not Null).
- status: Status of the item (e.g., Lost, Found, Claimed) (Not Null).
- finder_id: Foreign key referencing the user_id of the user who found the item.
- claimer_id: Foreign key referencing the user_id of the user who claimed the item.
- found_date: Date and time when the item was found (DateTime).
- description: Description of the item provided by the user.

#### Claims Table
The Claims table manages claims made by users for found items.

- claim_id: Unique identifier for each claim (Primary Key).
- item_id: Foreign key referencing the item_id of the claimed item (Not Null).
- claimer_id: Foreign key referencing the user_id of the user making the claim (Not Null).
- contact_info: Contact information provided by the claimant (Not Null).
- status: Status of the claim (e.g., Pending, Accepted, Rejected) (Not Null).
The database schema is designed to facilitate the process of reporting lost items, searching for found items, and managing claims effectively, ensuring smooth coordination and communication among users.

### API Usage

We have integrated a third-party API provided by [API Ninjas](https://api-ninjas.com/api) to generate inspirational quotes on the main page of our website. This API allows us to dynamically fetch motivational quotes to inspire and uplift our users.

The API provides a simple endpoint to retrieve random quotes, making it easy for us to incorporate fresh and meaningful content into our platform.

For more information about the API and its usage, please refer to the [API Ninjas Quotes API documentation](https://api-ninjas.com/api/quotes).

### Demo Presentation

To get a visual walkthrough of our Lost and Found Website and its features, please check out our demo presentation:
[demo link](https://unc.zoom.us/rec/share/LGx3LEENopZG2-m9qZPFgicy6nhdx-eUhdXWnsUHSgv-9V6pj4yhvq67J7nPJ2M0.u1VtIliX6kdhNixq)


This presentation provides an overview of the functionality and user experience of our platform, including how to report lost items, search for found items, and manage user profiles.

Feel free to explore the presentation to learn more about our project!
