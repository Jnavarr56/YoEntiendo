class UpdateTracksController < ApplicationController
    before_action :authenticate_user!
    

    def show
        
        

        
    end

    private
    
    def usertrack_params
        params.require(:usertrack)
    end

end
