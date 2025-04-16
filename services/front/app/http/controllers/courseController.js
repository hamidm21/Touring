const controller = require('app/http/controllers/controller');
const singleTrips = require('../../models/trips');
const validator = require("app/http/validators/joi");

class courseController extends controller {
    async index(req , res){
        let query = {};
        let { search, page = 1 } = req.query;
        // console.log( req.query );
        let recentTrips = JSON.parse(await singleTrips.search( search ,16 , page ));
        let pagination = {
            pages: recentTrips.data.totalCount / 16,
            page,
        };
        console.log(recentTrips.data);
        res.render('home/search',  { title : 'جست و جوی تور ها' , trip : recentTrips.data.trips  , pagination  , page });

    }
    async signGet(req , res) {
        const trip = JSON.parse(await singleTrips.getOneBySlug(req.params.slug));
        console.log(trip.data.trip);
        const count = req.query.count;
        const newPrice = trip.data.trip.price * count;
        const errors = req.flash("error");

        res.render('home/sign' , { errors, count : count , newPrice: newPrice  , trip: trip.data.trip });
    }

    async sign(req , res) {
        const registers = [];
        for (let i = 0; i < req.body.mid.length; i++) {
            const {error, valid} = validator.form.validate({
                fullName: req.body.fullName[i],
                phoneNumber: req.body.phoneNumber[i],
                mid: req.body.mid[i]
            })
            console.log({error, valid})
            if (!error) {
                registers.push({
                    fullName: req.body.fullName[i],
                    phoneNumber: req.body.phoneNumber[i],
                    mid: req.body.mid[i]
                });
            } else {
                req.flash("error", "اطلاعات وارد شده صحیح نمیباشد")
                res.redirect(req.path + "?count=" + req.query.count)
            }
            
        }
        console.log({registers});
        const trip = JSON.parse(await singleTrips.getOneBySlug(req.params.slug));

        // console.log(trip.data);
        
        const request = JSON.parse(await singleTrips.unAuthRequest(trip.data.trip.id, registers));
        // console.log(request);
        res.redirect(request.data.payment.paymentURL);
    }

    async single(req , res) {

        // console.log(req.params);
        const trip = JSON.parse(await singleTrips.getOneBySlug(req.params.slug));
        // console.log(trip.data.trip);    
        const getPopular = JSON.parse(await singleTrips.getPopular(4, 1));
        res.render('home/single-course' , {trip: trip.data.trip , getPopular : getPopular.data.trips });
    }

    async posts(req , res) {
        let page = req.query.page || 1;
        let recentTrips = JSON.parse(await singleTrips.getRecents( 16 , page ));
        let pagination = {
            pages: Math.ceil(recentTrips.data.totalCount / 16),
            page,
        }
        console.log({pagination, recentTrips})
        res.render('home/posts',  { title : 'تور ها' , trip : recentTrips.data.trips , pagination  , page  });


    }
    // async posts(req , res) {
    //     let page = 1;
    //     let recentTrips = JSON.parse(await singleTrips.getRecents( 16 , page ));
    //     // console.log(recentTrips.data.trips);
    //     let pagination = {
    //         pages: recentTrips.data.totalCount / 16,
    //         page,
    //     }
    //     res.render('home/posts',  { title : 'تور ها' , trip : recentTrips.data.trips , pagination  , page  });
    //
    //
    // }




}

module.exports = new courseController();