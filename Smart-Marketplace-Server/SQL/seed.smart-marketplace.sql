
INSERT INTO users
    (Name, Email, Location, Username, Password)
VALUES
    ('Anthony Bostic', 'anthonytb97@gmail.com', 'Seattle, WA', 'Anthony', 'abcd1234'),
    ('test user1', 'test1@gmail.com', 'Seattle, WA', 'test1', 'abcd1234'),
    ('test user2', 'test2@gmail.com', 'Seattle, WA', 'test2', 'abcd1234'),
    ('test user3', 'test3@gmail.com', 'Seattle, WA', 'test3', 'abcd1234');

INSERT INTO listings
    (Title, Owner, Location, Date, Condition, Price, Description)
VALUES
    ('Test1', 'Anthony', 'Seattle, WA', now(), 'New', '$900', 'cool item'),
    ('Test2', 'Test2', 'Seattle, WA', now(), 'Old', '$90', 'cool item'),
    ('Test3', 'Anthony', 'Seattle, WA', now(), 'Slightly used', '$9', 'cool item'),
    ('Test4', 'Anthony', 'Seattle, WA', now(), 'New', '$900', 'cool item');

