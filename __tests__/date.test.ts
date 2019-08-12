import MockDate from "mockdate";
import { isYesterday, isTooPast } from "../src/date";

describe("#isYesterday returns boolean that calculated by local timezone", () => {
  describe("current time: 2019-07-21 15:00:00 UTC", () => {
    beforeAll(() => {
      // 2019-07-21 15:00:01 UTC
      MockDate.set(1563721201 * 1000);
    });

    // EST -0500 (EDT -0400) at New York
    //   Local Time: 2019-07-21 10:00:00 (Oh, Summer Time! / EDT -0400)
    //
    describe("TZ: Eastern Standard Time", () => {
      // Local Time: 2019-07-19 23:59:59
      describe("argument is 2019-07-20 03:59:59", () => {
        it("is day before yesterday, returns false", () => {
          expect(isYesterday("Sat Jul 20 03:59:59 +0000 2019", "Eastern Standard Time")).toBeFalsy();
        });
      });

      // Local Time: 2019-07-20 00:00:00
      describe("argument is 2019-07-20 04:00:00", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 20 04:00:00 +0000 2019", "Eastern Standard Time")).toBeTruthy();
        });
      });

      // Local Time: 2019-07-20 23:59:59
      describe("argument is 2019-07-21 03:59:59", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 21 03:59:59 +0000 2019", "Eastern Standard Time")).toBeTruthy();
        });
      });

      // Local Time: 2019-07-21 00:00:00
      describe("argument is 2019-07-21 04:00:00", () => {
        it("is today, returns false", () => {
          expect(isYesterday("Sat Jul 21 04:00:00 +0000 2019", "Eastern Standard Time")).toBeFalsy();
        });
      });
    });

    // UTC +0000 (BST +0100) at London
    //   Local Time: 2019-07-21 15:00:00 (Oh, Summer Time! / BST +0100)
    describe("TZ: GMT Standard Time", () => {
      describe("argument is 2019-07-19 22:59:59", () => {
        it("is day before yesterday, returns false", () => {
          expect(isYesterday("Sat Jul 19 22:59:59 +0000 2019", "GMT Standard Time")).toBeFalsy();
        });
      });

      describe("argument is 2019-07-19 23:00:00", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 19 23:00:00 +0000 2019", "GMT Standard Time")).toBeTruthy();
        });
      });

      describe("argument is 2019-07-20 22:59:59", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 20 22:59:59 +0000 2019", "GMT Standard Time")).toBeTruthy();
        });
      });

      describe("argument is 2019-07-20 23:00:00", () => {
        it("is today, returns false", () => {
          expect(isYesterday("Sat Jul 20 23:00:00 +0000 2019", "GMT Standard Time")).toBeFalsy();
        });
      });
    });

    // JST Tokyo Standard Time at Tokyo
    //   Local Time: 2019-07-22 00:00:00 (NOTE: JST is going to tomorrow!!)
    describe("TZ: Tokyo Standard Time", () => {
      // Local Time: 2019-07-21 23:59:59
      describe("argument is 2019-07-20 14:59:59", () => {
        it("is day before yesterday, returns false", () => {
          expect(isYesterday("Sat Jul 20 14:59:59 +0000 2019", "Tokyo Standard Time")).toBeFalsy();
        });
      });

      // Local Time: 2019-07-21 00:00:00
      describe("argument is 2019-07-19 15:00:00", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 20 15:00:00 +0000 2019", "Tokyo Standard Time")).toBeTruthy();
        });
      });

      // Local Time: 2019-07-21 23:59:59
      describe("argument is 2019-07-21 14:59:59", () => {
        it("is yesterday, returns true", () => {
          expect(isYesterday("Sat Jul 21 14:59:59 +0000 2019", "Tokyo Standard Time")).toBeTruthy();
        });
      });

      // Local Time: 2019-07-22 00:00:00
      describe("argument is 2019-07-21 15:00:00", () => {
        it("is today, returns false", () => {
          expect(isYesterday("Sat Jul 21 15:00:00 +0000 2019", "Tokyo Standard Time")).toBeFalsy();
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

  // EST -0500 (EDT -0400) at New York
  //   Local Time: 2019-07-21 10:00:00 (Oh, Summer Time! / EDT -0400)
  //
  describe("TZ: Eastern Standard Time", () => {
    // Local Time: 2019-07-19 23:59:59
    describe("argument is 2019-07-19 03:59:59", () => {
      it("is 2 or greater days ago, returns true", () => {
        expect(isTooPast("Sat Jul 20 03:59:59 +0000 2019", "Eastern Standard Time")).toBeTruthy();
      });
    });

    // Local Time: 2019-07-20 00:00:00
    describe("argument is 2019-07-19 04:00:00", () => {
      it("is yesterday, returns false", () => {
        expect(isTooPast("Sat Jul 20 04:00:00 +0000 2019", "Eastern Standard Time")).toBeFalsy();
      });
    });
  });

  // UTC +0000 (BST +0100) at London
  //   Local Time: 2019-07-21 15:00:00 (Oh, Summer Time! / BST +0100)
  describe("TZ: +0000", () => {
    describe("argument is 2019-07-19 22:59:59", () => {
      it("is 2 or greater days ago, returns true", () => {
        expect(isTooPast("Sat Jul 19 22:59:59 +0000 2019", "GMT Standard Time")).toBeTruthy();
      });
    });

    describe("argument is 2019-07-19 23:00:00", () => {
      it("is yesterday, returns false", () => {
        expect(isTooPast("Sat Jul 19 23:00:00 +0000 2019", "GMT Standard Time")).toBeFalsy();
      });
    });
  });

  // JST Tokyo Standard Time at TOkyo
  //   Local Time: 2019-07-22 00:00:00 (NOTE: JST is going to tomorrow!!)
  //
  describe("TZ: Tokyo Standard Time", () => {
    // Local Time: 2019-07-19 23:59:59
    describe("argument is 2019-07-19 04:59:59", () => {
      it("is 2 or greater days ago, returns true", () => {
        expect(isTooPast("Sat Jul 20 14:59:59 +0000 2019", "Tokyo Standard Time")).toBeTruthy();
      });
    });

    // Local Time: 2019-07-20 00:00:00
    describe("argument is 2019-07-19 05:00:00", () => {
      it("is yesterday, returns false", () => {
        expect(isTooPast("Sat Jul 20 15:00:00 +0000 2019", "Tokyo Standard Time")).toBeFalsy();
      });
    });
  });

  afterAll(() => {
    MockDate.reset();
  });
});
