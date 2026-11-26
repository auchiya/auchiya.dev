import basketCoffeeMeasure from "./images/01-basketCoffeeMeasure.webp";
import basketCoffeeMeasureSide from "./images/02-basketCoffeeMeasure_Side.webp";
import basketCoffeeMeasureAngle from "./images/03-basketCoffeeMeasure_Angle.webp";
import coffeeWeight from "./images/04-coffeeWeight.webp";
import aeropressFilter from "./images/05-aeropressFilter.webp";
import aeropressFilterTopChamber from "./images/06-aeropressFilter-topChamber.webp";
import coffeeGrounded from "./images/07-coffeeGrounded.webp";
import coffeeGroundedBasket from "./images/08-coffeeGrounded-basket.webp";
import coffeeGroundedBasketSide from "./images/09-coffeeGrounded-basketSide.webp";
import waterBottomChamber from "./images/10-waterBottomChamber.webp";
import mokapotInit from "./images/11-mokapot-init.webp";
import mokapotFlowStartWide from "./images/12-mokapot-flowStart.webp";
import mokapotFlowStart from "./images/13-mokapot-flowStart.webp";
import mokapotFlowStartClose from "./images/14-mokapot-flowStart.webp";
import mokapotFlowing from "./images/15-mokapot-flowing.webp";
import mokapotFlowingEnding from "./images/16-mokapot-flowingEnding.webp";
import mokapotResultWithFoam from "./images/17-mokapot-resultWithFoam.webp";
import mokapotResultWithoutFoam from "./images/18-mokapot-resultWithoutFoam.webp";
import mokapotResultWithoutFoamSide from "./images/19-mokapot-resultWithoutFoam.webp";
import mokapotBrewingResult from "./images/20-mokapot-brewingResult.webp";
import mokapotBottomChamberAfterBrewing from "./images/21-mokapot-bottomChamberAfterBrewing.webp";
import coffeeCup from "./images/22-coffeeCup.webp";
import coffeeCupWithWaterWide from "./images/23-coffeeCupWithWater.webp";
import coffeeCupWithWater from "./images/24-coffeeCupWithWater.webp";
import baratzaGrinderSetting from "./images/baratzaGrinderSetting.webp";

/**
 * Moka recipe photos, imported here (a `.ts` module) so each entry carries its
 * intrinsic `src`, `width` and `height`. MDX image imports only return a URL.
 */
export const mokaImages = {
  "01-basketCoffeeMeasure": basketCoffeeMeasure,
  "02-basketCoffeeMeasure_Side": basketCoffeeMeasureSide,
  "03-basketCoffeeMeasure_Angle": basketCoffeeMeasureAngle,
  "04-coffeeWeight": coffeeWeight,
  "05-aeropressFilter": aeropressFilter,
  "06-aeropressFilter-topChamber": aeropressFilterTopChamber,
  "07-coffeeGrounded": coffeeGrounded,
  "08-coffeeGrounded-basket": coffeeGroundedBasket,
  "09-coffeeGrounded-basketSide": coffeeGroundedBasketSide,
  "10-waterBottomChamber": waterBottomChamber,
  "11-mokapot-init": mokapotInit,
  "12-mokapot-flowStart": mokapotFlowStartWide,
  "13-mokapot-flowStart": mokapotFlowStart,
  "14-mokapot-flowStart": mokapotFlowStartClose,
  "15-mokapot-flowing": mokapotFlowing,
  "16-mokapot-flowingEnding": mokapotFlowingEnding,
  "17-mokapot-resultWithFoam": mokapotResultWithFoam,
  "18-mokapot-resultWithoutFoam": mokapotResultWithoutFoam,
  "19-mokapot-resultWithoutFoam": mokapotResultWithoutFoamSide,
  "20-mokapot-brewingResult": mokapotBrewingResult,
  "21-mokapot-bottomChamberAfterBrewing": mokapotBottomChamberAfterBrewing,
  "22-coffeeCup": coffeeCup,
  "23-coffeeCupWithWater": coffeeCupWithWaterWide,
  "24-coffeeCupWithWater": coffeeCupWithWater,
  baratzaGrinderSetting,
} as const;
