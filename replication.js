var PouchDB = require("pouchdb");
// var db = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesalemenus"); 
var dbRemoteInventory = new PouchDB("https://ttlyhatenewormonewistare:b714d61254fb4782ab1994111c49e44b86f94996@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/buywholesaleinventory");
var dbLocalInventory = new PouchDB("inventory");
var dbRemoteMenus = new PouchDB("https://forkshgressithervionally:fbe37c1a9cc85dc7f6eb7bcb9bd29aae4870beed@55644244-4beb-4ca8-b177-8ff6d5c3cc0b-bluemix.cloudant.com/menardsmenusv2"); 
var dbLocalMenus = new PouchDB("menus");

dbLocalMenus.replicate.to(dbRemoteMenus);

dbLocalInventory.replicate.to(dbRemoteInventory);
