import { Injectable } from '@angular/core';
import { APIClient } from '../shared/APIClient';

export type PilotDTO = {
  pilotId: string;
  pilotName: string;
  averageRating?: number;
  mostFlownAircraft?: string;
  pireps: number;
};

@Injectable({
  providedIn: 'root',
})
export class PilotsClient extends APIClient {
  fetchPilots() {
    return this.http.get<PilotDTO[]>(`${this.apiServerBaseUrl}/users/pilots`);
  }

  fetchPilot(id: string) {
    return this.http.get<PilotDTO>(
      `${this.apiServerBaseUrl}/users/${id}/stats`
    );
  }
}
