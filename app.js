const Express = require("express");
const app = new Express();

//Cors
const cors = require("cors");
app.use(cors());

//Session import
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");

//bcrypt
var bcrypt = require('bcryptjs');

//Body parser
app.use (Express.urlencoded ({ extended: true }));
app.use (Express.json());

//Models
const adminsModel = require("./database/models/adminsModel");
const clientsModel = require("./database/models/clientsModel");
const ordersModel = require("./database/models/ordersModel");
const partnersModel = require("./database/models/partnersModel");
const categoriesModel = require("./database/models/categoriesModel");
const productsModel = require("./database/models/productsModel");
const schedulesModel = require("./database/models/schedulesModel");

//Session
//Cookie Parser
app.use(cookieParser("4gsa4859g4sa"));
//Express session
app.set('trust proxy', 1)
app.use(session({
  secret: 'SAD489489fSAFFSA',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: (60000 * 60) * 24 }
}));
//Express flash
app.use(flash());

//View engine
app.set("view engine", "ejs");
app.use(Express.static('public'));


//RoutesAdmin
const adminMainRoutes = require("./routes/web/admin/adminMainRoutes");
app.use("/admin", adminMainRoutes);
const adminAuthRoutes = require("./routes/web/admin/adminAuthRoutes");
app.use("/admin", adminAuthRoutes);
const adminCategoriesRoutes = require("./routes/web/admin/adminCategoriesRoutes");
app.use("/admin", adminCategoriesRoutes);
const adminProductsRoutes = require("./routes/web/admin/adminProductsRoutes");
app.use("/admin", adminProductsRoutes);
const adminPartnersRoutes = require("./routes/web/admin/adminPartnersRoutes");
app.use("/admin", adminPartnersRoutes);
const adminConfigRoutes = require("./routes/web/admin/adminConfigRoutes");
app.use("/admin", adminConfigRoutes);
const adminClientsRoutes = require("./routes/web/admin/adminClientsRoutes");
app.use("/admin", adminClientsRoutes);

//RoutesPartner
const partnerMainRoutes = require("./routes/web/partner/partnerMainRoutes");
app.use("/partner", partnerMainRoutes);
const partnerAuthRoutes = require("./routes/web/partner/partnerAuthRoutes");
app.use("/partner", partnerAuthRoutes);
const partnerOrdersRoutes = require("./routes/web/partner/partnerOrdersRoutes");
app.use("/partner", partnerOrdersRoutes);
const partnerConfigRoutes = require("./routes/web/partner/partnerConfigRoutes");
app.use("/partner", partnerConfigRoutes);

//RoutesClients
const clientMainRoutes = require("./routes/web/client/clientMainRoutes");
app.use(clientMainRoutes);
const clientAuthRoutes = require("./routes/web/client/clientAuthRoutes");
app.use(clientAuthRoutes);
const clientDeliveryRoutes = require("./routes/web/client/clientDeliveryRoutes");
app.use("/delivery", clientDeliveryRoutes);

//RoutesApi
const apiProductsRoutes = require("./routes/api/apiProductsRoutes");
app.use("/api", apiProductsRoutes);
const apiCategoriesRoutes = require("./routes/api/apiCategoriesRoutes");
app.use("/api", apiCategoriesRoutes);
const apiClientsRoutes = require("./routes/api/apiClientsRoutes");
app.use("/api", apiClientsRoutes);
const apiOrdersRoutes = require("./routes/api/apiOrdersRoutes");
app.use("/api", apiOrdersRoutes);

app.get("*", function(req, res){
    res.status(404).render("notfound");
});

app.listen(8090, () => {
  adminsModel.findAll().then((admins) => {
    if (admins == ""){
      adminsModel.create({
        id: 1,
        name: "Administrador",
        email: "admin@admin.com",
        password: bcrypt.hashSync("admin@123"),
        createdA: "1000-01-01 00:00:00",
        updatedAt: "1000-01-01 00:00:00",
      }).then(() => {}).catch((error) => console.log("Erro: " + error));
    }
  }).catch((error) => console.log("Erro: " + error));
  partnersModel.findAll().then((partners) => {
    if (partners == ""){
      partnersModel.create({
        id: 1,
        name: "Partner",
        email: "partner@partner.com",
        phone: "(99) 99999-9999",
        cep: "99999-999",
        city: "Cidade",
        district: "Bairro",
        address: "Endereço",
        number: "0",
        coordinatesA: "0",
        coordinatesB: "0",
        document: "Documento",
        password: bcrypt.hashSync("partner@123"),
        createdA: "1000-01-01 00:00:00",
        updatedAt: "1000-01-01 00:00:00",
      }).then(() => {}).catch((error) => console.log("Erro: " + error));
    }
  }).catch((error) => console.log("Erro: " + error));
  console.log("Servidor Loja1Real rodando");
});