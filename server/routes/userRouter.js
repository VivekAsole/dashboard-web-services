import { Router } from "express";
import { getCollection } from "../controllers/collectionControllers.js";
import { newCustomers, repeatCustomers } from "../controllers/customerCollections.js";
import { geoDistribution } from "../controllers/geoDistribution.js";
import { clvCohorts } from "../controllers/CLV_by_cohorts.js";

const router = Router()

router.route("/data/:interval").get( getCollection )
router.route("/newCustomers").get( newCustomers )
router.route("/repeatCustomers/:interval").get( repeatCustomers )
router.route("/geoDistribution").get( geoDistribution )
router.route("/clvCohorts").get( clvCohorts )

export default router;