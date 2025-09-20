const { GraphQLError } = require("graphql");
const { AuthenticationError } = require("@apollo/server/errors");
const { PubSub } = require("graphql-subscriptions");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return [];
        filter.author = author._id;
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      return await Book.find(filter).populate("author");
    },
    allAuthors: async () => {
      return await Author.find();
    },
    me: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("You must be logged in");
      }

      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("You must be logged in");
      }

      let author = null;
      let book = null;

      try {
        author = await Author.findOne({ name: args.author });

        if (!author) {
          author = new Author({
            name: args.author,
            born: null,
          });

          author = await author.save();
        }
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Faild to save author", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: Object.keys(error.errors),
              originalError: error,
            },
          });
        }
      }

      try {
        book = new Book({ ...args, author: author._id });
        book = await book.save();
        await book.populate("author");
        await Author.findByIdAndUpdate(author._id, { $inc: { bookCount: 1 } });
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Faild to save book", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: Object.keys(error.errors),
              originalError: error,
            },
          });
        }
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("You must be logged in");
      }

      const author = await Author.findOne({ name: args.name });
      if (author) {
        author.born = args.setBornTo;
        return await author.save();
      }
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      return await user.save();
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
