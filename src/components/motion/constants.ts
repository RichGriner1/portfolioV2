// The names figures and the bento already import, pointed at the one motion
// module (src/lib/motion). EASE_SOFT and the two springs collapse onto the DS's
// single out-curve and single spring.
export {
  EASE,
  EASE as EASE_SOFT,
  EASE_IN_OUT as EASE_IN_OUT_SOFT,
  EASE_SPRING,
  SPRING as SPRING_SOFT,
  SPRING as SPRING_SNAP,
} from "@/lib/motion";
