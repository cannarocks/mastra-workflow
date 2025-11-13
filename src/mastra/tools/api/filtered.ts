export type StrapiTemplate = {
  background?: string;
  description: string;
  how?: {
    description: string;
    /** Format: uri */
    icon: string;
    title: string;
  }[];
  /** Format: uri */
  image?: string;
  /** Format: uri */
  output_image?: string;
  pre_title: string;
  price?: {
    /** @default 0 */
    is_strikethrough?: number;
    previous_price?: string;
    price: string;
  };
  requirements?: {
    description: string;
    list: string[];
  };
  tags: {
    /** Format: uri */
    icon: string;
    text: string;
  }[];
  title: string;
  what?: {
    description: string;
    goal: string;
  };
  why?: {
    advantages: string[];
    reasons: {
      description: string;
      /** Format: uri */
      icon: string;
      title: string;
    }[];
  };
};
export type CpReqTemplate = {
  category_id: number;
  config: string;
  description?: string;
  id: number;
  name: string;
  price?: string;
  strapi?: StrapiTemplate;
  workspace_id?: number;
};

export type PlanStatus = "pending_review" | "draft" | "approved" | "paying";

/** OutputModuleTouchpointsAppDesktop */
export type OutputModuleTouchpointsAppDesktop = {
  /** @enum {undefined} */
  form_factor: "desktop";
  /** @enum {undefined} */
  kind: "app";
  os: {
    linux?: string;
    macos?: string;
    windows?: string;
  };
};
/** OutputModuleTouchpointsAppSmartphone */
export type OutputModuleTouchpointsAppSmartphone = {
  /** @enum {undefined} */
  form_factor: "smartphone";
  /** @enum {undefined} */
  kind: "app";
  os: {
    android?: string;
    ios?: string;
  };
};
/** OutputModuleTouchpointsAppTablet */
export type OutputModuleTouchpointsAppTablet = {
  /** @enum {undefined} */
  form_factor: "tablet";
  /** @enum {undefined} */
  kind: "app";
  os: {
    ios?: string;
    android?: string;
  };
};
/** OutputModuleTouchpointsWebDesktop */
export type OutputModuleTouchpointsWebDesktop = {
  /** @enum {undefined} */
  form_factor: "desktop";
  /** @enum {undefined} */
  kind: "web";
  os: {
    linux?: string;
    macos?: string;
    windows?: string;
  };
};
/** OutputModuleTouchpointsWebSmartphone */
export type OutputModuleTouchpointsWebSmartphone = {
  /** @enum {undefined} */
  form_factor: "smartphone";
  /** @enum {undefined} */
  kind: "web";
  os: {
    android?: string;
    ios?: string;
  };
};
/** OutputModuleTouchpointsWebTablet */
export type OutputModuleTouchpointsWebTablet = {
  /** @enum {undefined} */
  form_factor: "tablet";
  /** @enum {undefined} */
  kind: "web";
  os: {
    android?: string;
    ios?: string;
  };
};
export type OutputServiceProviders = {
  isOther?: number;
  name: string;
}[];

export type OutputModuleTouchpoints =
  | OutputModuleTouchpointsAppDesktop
  | OutputModuleTouchpointsAppTablet
  | OutputModuleTouchpointsAppSmartphone
  | OutputModuleTouchpointsWebDesktop
  | OutputModuleTouchpointsWebTablet
  | OutputModuleTouchpointsWebSmartphone;

export type OutputModuleTaskAccessibility = {
  description?: string;
  id?: string;
  kind: "accessibility";
  title: string;
  url?: string;
};

export type OutputModuleTaskBug = {
  description?: string;
  id?: string;
  kind: "bug";
  title: string;
  url?: string;
};

export type OutputModuleTaskExplorativeBug = {
  description?: string;
  id?: string;
  kind: "explorative-bug";
  title: string;
  url?: string;
};

export type OutputModuleTaskModerateVideo = {
  description?: string;
  id?: string;
  kind: "moderate-video";
  title: string;
  url?: string;
};

export type OutputModuleTaskSurvey = {
  description?: string;
  id?: string;
  kind: "survey";
  title: string;
  url?: string;
};

export type OutputModuleTaskVideo = {
  description?: string;
  id?: string;
  kind: "video";
  title: string;
  url?: string;
};

export type OutputModuleTask =
  | OutputModuleTaskVideo
  | OutputModuleTaskBug
  | OutputModuleTaskSurvey
  | OutputModuleTaskModerateVideo
  | OutputModuleTaskExplorativeBug
  | OutputModuleTaskAccessibility;

export type ModuleAdditionalTarget = {
  output: string;
  /** @enum {string} */
  type: "additional_target";
  variant: string;
};
export type OutputModuleAge = {
  max: number;
  min: number;
  percentage: number;
}[];

export type OutputModuleBrowser = {
  name: "firefox" | "edge" | "chrome" | "safari";
  percentage: number;
}[];

export type OutputModuleGender = {
  gender: "male" | "female";
  percentage: number;
}[];

export type OutputModuleIncomeRange = {
  max: number;
  min: number;
  percentage: number;
}[];

export type OutputModuleLiteracy = {
  level: "beginner" | "intermediate" | "expert";
  percentage: number;
}[];

export type OutputModuleLocality = {
  type: string;
  values: string[];
}[];

/** ModuleAge */
export type ModuleAge = {
  output: OutputModuleAge;
  /** @enum {string} */
  type: "age";
  variant: string;
};
/** ModuleAnnualIncomeRange */
export type ModuleAnnualIncomeRange = {
  output: OutputModuleIncomeRange;
  /** @enum {string} */
  type: "annual_income_range";
  variant: string;
};
/** ModuleBank */
export type ModuleBank = {
  output: OutputServiceProviders;
  /** @enum {string} */
  type: "bank";
  variant: string;
};
/** ModuleBrowser */
export type ModuleBrowser = {
  output: OutputModuleBrowser;
  /** @enum {string} */
  type: "browser";
  variant: string;
};
export type ModuleDate = {
  output: {
    start: string;
  };
  /** @enum {string} */
  type: "dates";
  variant: string;
};
/** ModuleElettricitySupply */
export type ModuleElettricitySupply = {
  output: OutputServiceProviders;
  /** @enum {string} */
  type: "elettricity_supply";
  variant: string;
};
/** ModuleEmployment */
export type ModuleEmployment = {
  /** @description cuf values of cuf employment */
  output: (
    | "EMPLOYEE"
    | "FREELANCER"
    | "RETIRED"
    | "STUDENT"
    | "UNEMPLOYED"
    | "HOMEMAKER"
  )[];
  /** @enum {string} */
  type: "employment";
  variant: string;
};
/** ModuleGasSupply */
export type ModuleGasSupply = {
  output: OutputServiceProviders;
  /** @enum {string} */
  type: "gas_supply";
  variant: string;
};
/** ModuleGender */
export type ModuleGender = {
  output: OutputModuleGender;
  /** @enum {string} */
  type: "gender";
  variant: string;
};
export type ModuleGoal = {
  output: string;
  /** @enum {string} */
  type: "goal";
  variant: string;
};
/** ModuleHomeInternet */
export type ModuleHomeInternet = {
  output: OutputServiceProviders;
  /** @enum {string} */
  type: "home_internet";
  variant: string;
};
/** ModuleInstructionNote */
export type ModuleInstructionNote = {
  output: string;
  /** @enum {string} */
  type: "instruction_note";
  variant: string;
};
/** ModuleLanguage */
export type ModuleLanguage = {
  output: string;
  /** @enum {string} */
  type: "language";
  variant: string;
};
/** ModuleLiteracy */
export type ModuleLiteracy = {
  output: OutputModuleLiteracy;
  /** @enum {string} */
  type: "literacy";
  variant: string;
};
/** ModuleLocality */
export type ModuleLocality = {
  output: OutputModuleLocality;
  /** @enum {string} */
  type: "locality";
  variant: string;
};
/** ModuleMobileInternet */
export type ModuleMobileInternet = {
  output: OutputServiceProviders;
  /** @enum {string} */
  type: "mobile_internet";
  variant: string;
};
export type ModuleOutOfScope = {
  output: string;
  /** @enum {string} */
  type: "out_of_scope";
  variant: string;
};
/** ModuleSetupNote */
export type ModuleSetupNote = {
  output: string;
  /** @enum {string} */
  type: "setup_note";
  variant: string;
};
/** ModuleTarget */
export type ModuleTarget = {
  output: number;
  /** @enum {string} */
  type: "target";
  variant: string;
};
/** ModuleTargetNote */
export type ModuleTargetNote = {
  output: string;
  /** @enum {string} */
  type: "target_note";
  variant: string;
};
/** ModuleTask */
export type ModuleTask = {
  output: OutputModuleTask[];
  /** @enum {string} */
  type: "tasks";
  variant: string;
};
export type ModuleTitle = {
  output: string;
  /** @enum {string} */
  type: "title";
  variant: string;
};
/** ModuleTouchpoints */
export type ModuleTouchpoints = {
  output: OutputModuleTouchpoints[];
  /** @enum {string} */
  type: "touchpoints";
  variant: string;
};

export type Module =
  | ModuleTitle
  | ModuleDate
  | ModuleTask
  | ModuleAge
  | ModuleLanguage
  | ModuleLiteracy
  | ModuleTarget
  | ModuleGoal
  | ModuleGender
  | ModuleOutOfScope
  | ModuleBrowser
  | ModuleTargetNote
  | ModuleInstructionNote
  | ModuleSetupNote
  | ModuleTouchpoints
  | ModuleAdditionalTarget
  | ModuleEmployment
  | ModuleLocality
  | ModuleBank
  | ModuleElettricitySupply
  | ModuleMobileInternet
  | ModuleHomeInternet
  | ModuleGasSupply
  | ModuleAnnualIncomeRange;

export type CpReqPlans = {
  campaign?: {
    id: number;
    startDate: string;
    /** @description CustomerTitle ?? Title */
    title: string;
  };
  config: {
    modules: Module[];
  };
  from_template?: {
    id: number;
    title: string;
  };
  id: number;
  price?: string;
  project: {
    id: number;
    name: string;
  };
  quote?: {
    id: number;
    /** @enum {string} */
    status: "pending" | "proposed" | "approved" | "rejected";
    value: string;
  };
  status: PlanStatus;
  workspace_id: number;
};
