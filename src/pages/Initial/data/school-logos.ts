import { School } from "../../../context";

import MapleBearLogo from "../../../assets/images/maple-bear-logo.png";
import AdeliaCostaLogo from "../../../assets/images/adelia-costa-logo.png";
import SBLogo from "../../../assets/images/sb-logo.png";
import EducareLogo from "../../../assets/images/educare-logo.png";
import BekaLogo from "../../../assets/images/beka-logo.png";
import CincinattiLogo from "../../../assets/images/cincinatti-logo.png";
import DefaultLogo from "../../../assets/images/default-logo.png";
import SantaMryLogo from "../../../assets/images/st-mary-logo.png";
import CNALogo from "../../../assets/images/cna-logo.png";
import ColegioBisLogo from "../../../assets/images/colegio-bis-logo.png";
import ColegioDanteLogo from "../../../assets/images/colegio-dante-logo.png";

export const SCHOOL_LOGOS = {
  [School.Default]: DefaultLogo,
  [School.AdeliaCosta]: AdeliaCostaLogo,
  [School.SB]: SBLogo,
  [School.Educare]: EducareLogo,
  [School.Beka]: BekaLogo,
  [School.MapleBear]: MapleBearLogo,
  [School.Cincinatti]: CincinattiLogo,
  [School.StMary]: SantaMryLogo,
  [School.CNA]: CNALogo,
  [School.ColegioBis]: ColegioBisLogo,
  [School.ColegioDante]: ColegioDanteLogo,
};