let express = require('express');
let app = express();

let resolve = require('path');
let { sequelize } = require('./lib/index');
let { chef } = require('./models/chef.model');
let { dish } = require('./models/dish.model');

app.use(express.json());

let chefData = [
  { name: 'Gordon Ramsay', birthYear: 1966 },
  { name: 'Masaharu Morimoto', birthYear: 1955 },
  { name: 'Ricardo Larrivée', birthYear: 1967 },
];

let dishData = [
  {
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    preparationTime: 20,
  },
  {
    name: 'Sushi',
    cuisine: 'Japanese',
    preparationTime: 50,
  },
  {
    name: 'Poutine',
    cuisine: 'Canadian',
    preparationTime: 30,
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await chef.bulkCreate(chefData);

    await dish.bulkCreate(dishData);

    res.status(200).json({ message: 'Database seeding successfull' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

async function fetchAllChefs() {
  let chefs = await chef.findAll();
  return { chefs };
}

app.get('/chefs', async (req, res) => {
  try {
    let chefs = await fetchAllChefs();

    res.status(200).json(chefs);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching the data', error: error.message });
  }
});

async function fetchAllDishes() {
  let dishes = await dish.findAll();
  return { dishes };
}

app.get('/dishes', async (req, res) => {
  try {
    let dishes = await fetchAllDishes();

    res.status(200).json(dishes);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching the data', error: error.message });
  }
});

//Function to add new chef
async function addNewChef(newChef) {
  let response = await chef.create(newChef);

  return { response };
}

//Endpoint 1: Create New Chef
app.post('/chefs/new', async (req, res) => {
  try {
    let newChef = req.body.newChef;
    let response = await addNewChef(newChef);

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating the data', error: error.message });
  }
});

//Function to update chef by id
async function updateChefById(id, updatedChefData) {
  let chefDetails = await chef.findOne({ where: { id } });
  if (!chefDetails) {
    return {};
  }

  chefDetails.set(updatedChefData);
  let updatedChef = await chefDetails.save();

  return { message: 'Chef updated successfully', updatedChef };
}

//Endpoint 2: Update Chef by ID
app.post('/chefs/update/:id', async (req, res) => {
  try {
    let updatedChefData = req.body;
    let id = parseInt(req.params.id);

    let response = await updateChefById(id, updatedChefData);

    if (!response.message) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating the data', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
