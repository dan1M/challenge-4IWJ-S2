const sequelize = require("./db-sql");
const mongoose = require("./db-nosql");

const User = require("../models/sql/user");
const Product = require("../models/sql/product");
const Category = require("../models/sql/category");

const Order = require("../models/sql/order");
const DetailsOrder = require("../models/sql/detailsOrder");

sequelize.sync({ force: true });
