import MockDate from "mockdate";
import { calcTimeDifference, isYesterday, isTooPast } from "../src/date";

describe("#calcTimeDifference", () => {
  let diff: number = 0;

  // Tokyo, JP
  describe("when +0900", () => {
    beforeAll(() => {
      diff = calcTimeDifference("+0900");
    });

    it("returns 9", () => {
      expect(diff).toBe(9);
    });
  });

  // Darwin, AU
  describe("when +0930", () => {
    beforeAll(() => {
      diff = calcTimeDifference("+0930");
    });

    it("returns 9.5", () => {
      expect(diff).toBe(9.5);
    });
  });

  // London, GB
  describe("when +0000", () => {
    beforeAll(() => {
      diff = calcTimeDifference("+0000");
    });

    it("returns 0", () => {
      expect(diff).toBe(0);
    });
  });

  // San Francisco, US
  describe("when -0700", () => {
    beforeAll(() => {
      diff = calcTimeDifference("-0700");
    });

    it("returns -7", () => {
      expect(diff).toBe(-7);
    });
  });
});

describe("#isYesterday returns boolean that calculated by local timezone", () => {
  describe("current time: 2019-07-21 15:00:00 UTC", () => {
    beforeAll(() => {
      // 2019-07-21 15:00:01 UTC
      MockDate.set(1563721201 * 1000);
    });

    // EST -0500 at New York
    //   Local Time: 2019-07-21 10:00:00
    //
    describe("TZ: -0500", () => {
      // Local Time: 2019-07-19 23:59:59
      describe("argument is 2019-07-20 04:59:59", () => {
        it("is day before yesterday, returns false", () => {
          expect(isYesterday("Sat Jul 20 04:59:59 +0000 2019", "-0500")).toBeFalsy();
        });
      });

      // Local Time: 2019-07-20 00:00:00
      describe("argument is 2019-07-20 05:00:00", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 20 05:00:00 +0000 2019", "-0500")).toBeTruthy();
        });
      });

      // Local Time: 2019-07-20 23:59:59
      describe("argument is 2019-07-21 04:59:59", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 21 04:59:59 +0000 2019", "-0500")).toBeTruthy();
        });
      });

      // Local Time: 2019-07-21 00:00:00
      describe("argument is 2019-07-21 05:00:00", () => {
        it("is today, returns false", () => {
          expect(isYesterday("Sat Jul 21 05:00:00 +0000 2019", "-0500")).toBeFalsy();
        });
      });
    });

    // UTC +0000 at London
    //   Local Time: 2019-07-21 15:00:00
    describe("TZ: +0000", () => {
      describe("argument is 2019-07-19 23:59:59", () => {
        it("is day before yesterday, returns false", () => {
          expect(isYesterday("Sat Jul 19 23:59:59 +0000 2019", "+0000")).toBeFalsy();
        });
      });

      describe("argument is 2019-07-20 00:00:00", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 20 00:00:00 +0000 2019", "+0000")).toBeTruthy();
        });
      });

      describe("argument is 2019-07-20 23:59:59", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 20 23:59:59 +0000 2019", "+0000")).toBeTruthy();
        });
      });

      describe("argument is 2019-07-21 00:00:00", () => {
        it("is today, returns false", () => {
          expect(isYesterday("Sat Jul 21 00:00:00 +0000 2019", "+0000")).toBeFalsy();
        });
      });
    });

    // JST +0900 at Tokyo
    //   Local Time: 2019-07-22 00:00:00 (NOTE: JST is going to tommorow!!)
    describe("TZ: +0900", () => {
      // Local Time: 2019-07-21 23:59:59
      describe("argument is 2019-07-20 14:59:59", () => {
        it("is day before yesterday, returns false", () => {
          expect(isYesterday("Sat Jul 20 14:59:59 +0000 2019", "+0900")).toBeFalsy();
        });
      });

      // Local Time: 2019-07-21 00:00:00
      describe("argument is 2019-07-19 15:00:00", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 20 15:00:00 +0000 2019", "+0900")).toBeTruthy();
        });
      });

      // Local Time: 2019-07-21 23:59:59
      describe("argument is 2019-07-21 14:59:59", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 21 14:59:59 +0000 2019", "+0900")).toBeTruthy();
        });
      });

      // Local Time: 2019-07-22 00:00:00
      describe("argument is 2019-07-21 15:00:00", () => {
        it("is today, returns false", () => {
          expect(isYesterday("Sat Jul 21 15:00:00 +0000 2019", "+0900")).toBeFalsy();
        });
      });
    });

    afterAll(() => {
      MockDate.reset();
    });
  });
});

describe("#isTooPast returns boolean that calculated by local timezone", () => {
  beforeAll(() => {
    // 2019-07-21 15:00:01 UTC
    MockDate.set(1563721201 * 1000);
  });

  // EST -0500 at New York
  //   Local Time: 2019-07-21 10:00:00
  //
  describe("TZ: -0500", () => {
    // Local Time: 2019-07-19 23:59:59
    describe("argument is 2019-07-19 04:59:59", () => {
      it("is 2 or greater days ago, returns true", () => {
        expect(isTooPast("Sat Jul 20 04:59:59 +0000 2019", "-0500")).toBeTruthy();
      });
    });

    // Local Time: 2019-07-20 00:00:00
    describe("argument is 2019-07-19 05:00:00", () => {
      it("is yesterday, returns false", () => {
        expect(isTooPast("Sat Jul 20 05:00:00 +0000 2019", "-0500")).toBeFalsy();
      });
    });
  });

  // UTC +0000 at London
  //   Local Time: 2019-07-21 15:00:00
  describe("TZ: +0000", () => {
    describe("argument is 2019-07-19 23:59:59", () => {
      it("is 2 or greater days ago, returns true", () => {
        expect(isTooPast("Sat Jul 19 23:59:59 +0000 2019", "+0000")).toBeTruthy();
      });
    });

    describe("argument is 2019-07-20 00:00:00", () => {
      it("is yesterday, returns false", () => {
        expect(isTooPast("Sat Jul 20 00:00:00 +0000 2019", "+0000")).toBeFalsy();
      });
    });
  });

  // JST +0900 at TOkyo
  //   Local Time: 2019-07-22 00:00:00 (NOTE: JST is going to tommorow!!)
  //
  describe("TZ: +0900", () => {
    // Local Time: 2019-07-19 23:59:59
    describe("argument is 2019-07-19 04:59:59", () => {
      it("is 2 or greater days ago, returns true", () => {
        expect(isTooPast("Sat Jul 20 14:59:59 +0000 2019", "+0900")).toBeTruthy();
      });
    });

    // Local Time: 2019-07-20 00:00:00
    describe("argument is 2019-07-19 05:00:00", () => {
      it("is yesterday, returns false", () => {
        expect(isTooPast("Sat Jul 20 15:00:00 +0000 2019", "+0900")).toBeFalsy();
      });
    });
  });

  afterAll(() => {
    MockDate.reset();
  });
});
