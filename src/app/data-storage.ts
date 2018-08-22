import * as _ from 'lodash';

export class DataStorage<T> {
  constructor(public modifiedAt: Date, public data: T) {
  }

  isExpired(timeout: number): boolean {
      if (!_.isNil(this.modifiedAt)) {
          var currentDateTime = new Date();
          var formattedDateTimeWithTimeout = new Date(this.modifiedAt);

          formattedDateTimeWithTimeout.setSeconds(formattedDateTimeWithTimeout.getSeconds() + timeout);
          return formattedDateTimeWithTimeout < currentDateTime;
      }
      return false;

  }
}
