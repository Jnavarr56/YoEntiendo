module BasicModule

    def update_elapse_count(arg1)
        puts '---------'
        puts '---------'
        puts '---------'
        puts '---------'
        puts '---------'
        puts '---------'
        puts '---------'
        time_of_update = Time.zone.parse(arg1.to_s)
        currently = Time.zone.now
        difference = (currently - time_of_update)/1.minutes
        

        if difference < 60
            return "#{difference.floor} minutes ago"
        elsif difference >= 60 && difference < 1440
            return "#{(difference/60).floor} hours ago"
        else 
            return "#{(difference/1440).floor} days ago"
        end
    end
    
end