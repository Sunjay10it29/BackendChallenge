#### Requirements

Mongodb
NodeJS


#### Installation
1. Unzip the file
2. Install the application: `npm install`
3. Start the server: `node server.js`
4. Run getBike.sh `./getBike.sh` to get data in mongodb
5. Run getWeather.sh `./getWeather.sh` to get data in mongodb
6. View in postman at `http://localhost:3000`

#### Call APIs
As mentioned in test challenge
https://github.com/punkave/backend-challenge 

##### Downloading and using data in MongoDB
- Using Cron Job to download data from give link of Json data
- Downloadable instrcution is in .sh file named `getBike.sh` and `getWeather.sh`

#### Routes

- listening port 3000 (localhost:3000/api/v1/stations)
- localhost:3000/api/v1/stations/3006/?from=2019-04-30T16:29:39.771Z&to=2019-04-30T16:46:47.771Z
- localhost:3000/api/v1/stations/3006/?from=2019-04-30T16:29:39.771Z&to=2019-04-30T16:46:47.771Z

#### Author
- Sunjay Kumar
- This has been developed for Test Purpose
