import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RentalDataService } from './rental-data.service';

@Injectable()
export class RentalListener {
  constructor(private rentalDataService: RentalDataService) {}

  @OnEvent('user.before.delete', { async: true, promisify: true })
  async handleUserBeforeDelete(payload: { userId: string }) {
    const hasActiveRental = await this.rentalDataService.getActiveRentalByUser(
      payload.userId
    );

    if (hasActiveRental?.length) {
      return 'Cannot delete a user with an active car rental.';
    }
  }
}
